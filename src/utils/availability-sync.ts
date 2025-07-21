import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

const client = generateClient<Schema>();

/**
 * Utility functions for synchronizing availability between Availability table and ProviderProfile.availability field
 */

/**
 * Convert availability array to formatted strings for ProviderProfile
 * @param availabilityRecords - Records from Availability table
 * @returns Array of strings in format "yyyy-mm-dd:HH"
 */
interface AvailabilityRecord {
  date: string;
  time: string;
  isAvailable: boolean;
  [key: string]: unknown; // Add this if there may be extra fields
}

export function formatAvailabilityForProfile(availabilityRecords: AvailabilityRecord[]): string[] {
  return availabilityRecords
    .filter(record => record.isAvailable)
    .map(record => {
      const timeHour = record.time.split(":")[0];
      return `${record.date}:${timeHour}`;
    });
}

/**
 * Parse ProviderProfile availability strings back to date/time objects
 * @param availabilityStrings - Array of strings in format "yyyy-mm-dd:HH"
 * @returns Array of objects with date and time
 */
export function parseAvailabilityFromProfile(availabilityStrings: string[]): Array<{date: string, time: string}> {
  return availabilityStrings.map(str => {
    const [date, hour] = str.split(":");
    return {
      date,
      time: `${hour}:00`
    };
  });
}

/**
 * Sync availability from Availability table to ProviderProfile.availability field
 * @param providerId - Provider's user ID
 */
export async function syncAvailabilityToProfile(providerId: string): Promise<void> {
  try {
    // Get all availability records for the provider
    const { data: availabilityRecords } = await client.models.Availability.list({
      filter: {
        providerId: { eq: providerId }
      }
    });

    if (!availabilityRecords) {
      console.warn("No availability records found for provider:", providerId);
      return;
    }

    // Format for ProviderProfile field
    const availabilityStrings = formatAvailabilityForProfile(availabilityRecords);

    // Query ProviderProfile by userId to get the id
    const { data: profiles } = await client.models.ProviderProfile.list({
      filter: { userId: { eq: providerId } },
    });

    if (profiles && profiles.length > 0) {
      const existingProfile = profiles[0];
      await client.models.ProviderProfile.update({
        id: existingProfile.id,
        availability: availabilityStrings,
      } as unknown as Parameters<typeof client.models.ProviderProfile.update>[0]);
      console.log("Successfully synced availability to provider profile");
    } else {
      console.warn("No ProviderProfile found for provider:", providerId);
    }
  } catch (error) {
    console.error("Error syncing availability to profile:", error);
    throw error;
  }
}

/**
 * Get provider availability in a more readable format
 * @param providerId - Provider's user ID
 * @returns Object with availability grouped by date
 */
export async function getProviderAvailabilityGrouped(providerId: string): Promise<Record<string, string[]>> {
  try {
    // First, list profiles to find the one with the matching userId
    const { data: profiles } = await client.models.ProviderProfile.list({
      filter: { userId: { eq: providerId } },
    });

    if (!profiles || profiles.length === 0) {
      return {};
    }

    const profileId = profiles[0].id;
    const { data: profile } = await client.models.ProviderProfile.get({ id: profileId });

    if (!profile || !profile.availability) {
      return {};
    }

    const grouped: Record<string, string[]> = {};

    profile.availability.forEach(av => {
      const [date, hour] = av.split(":");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(`${hour}:00`);
    });

    // Sort times for each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort();
    });

    return grouped;
  } catch (error) {
    console.error("Error getting provider availability:", error);
    return {};
  }
}
