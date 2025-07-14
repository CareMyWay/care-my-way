"use client";

import { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

const client = generateClient<Schema>();

export default function ClientSettings() {
  const [profile, setProfile] = useState<
    Schema["ClientProfile"]["type"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const userId = attributes.sub;

        // Query ClientProfile where userId == Cognito sub
        const { data, errors } = await client.models.ClientProfile.list({
          filter: { userId: { eq: userId } },
          selectionSet: [
            "id",
            "firstName",
            "lastName",
            "email",
            "gender",
            "dateOfBirth",
            "address",
            "city",
            "province",
            "postalCode",
            "emergencyContactFirstName",
            "emergencyContactLastName",
            "emergencyContactPhone",
            "hasRepSupportPerson",
            "supportFirstName",
            "supportLastName",
            "supportRelationship",
            "supportContactPhone",
            "userId",
            "userType",
            "phoneNumber",
            "createdAt",
            "updatedAt",
          ],
        });

        if (errors) {
          console.error("GraphQL errors:", errors);
          setError("Failed to load profile due to server error.");
          return;
        }

        if (data.length > 0) {
          console.log("Loaded profile:", data[0]);
          setProfile(data[0]);
        } else {
          setError("No profile found.");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!profile) return <div>No profile data.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-6">Client Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <strong>First Name:</strong> {profile.firstName}
        </div>
        <div>
          <strong>Last Name:</strong> {profile.lastName}
        </div>
        <div>
          <strong>Email:</strong> {profile.email}
        </div>
        <div>
          <strong>Gender:</strong> {profile.gender}
        </div>
        <div>
          <strong>Date of Birth:</strong> {profile.dateOfBirth}
        </div>
        <div>
          <strong>Address:</strong> {profile.address}
        </div>
        <div>
          <strong>City:</strong> {profile.city}
        </div>
        <div>
          <strong>Province:</strong> {profile.province}
        </div>
        <div>
          <strong>Postal Code:</strong> {profile.postalCode}
        </div>
        <div>
          <strong>Emergency Contact:</strong>{" "}
          {profile.emergencyContactFirstName} {profile.emergencyContactLastName}
        </div>
        <div>
          <strong>Emergency Phone:</strong> {profile.emergencyContactPhone}
        </div>
        <div>
          <strong>Has Support Person:</strong>{" "}
          {profile.hasRepSupportPerson ? "Yes" : "No"}
        </div>
        {profile.hasRepSupportPerson && (
          <>
            <div>
              <strong>Support First Name:</strong> {profile.supportFirstName}
            </div>
            <div>
              <strong>Support Last Name:</strong> {profile.supportLastName}
            </div>
            <div>
              <strong>Support Relationship:</strong>{" "}
              {profile.supportRelationship}
            </div>
            <div>
              <strong>Support Phone:</strong> {profile.supportContactPhone}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
