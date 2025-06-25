"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card"
import { Button } from "@/components/provider-dashboard-ui/button"
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav"

export default function SettingsPage() {
  return (
    <>
      <TopNav title="Settings" notificationCount={2} />

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-400 dashboard-bg-primary rounded-md dashboard-card !shadow-none">
            <CardHeader>
              <CardTitle className="dashboard-text-primary">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium dashboard-text-primary mb-2">Language Preference</h4>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <h4 className="font-medium dashboard-text-primary mb-2">Time Zone</h4>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Pacific Time (PT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Central Time (CT)</option>
                  <option>Eastern Time (ET)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-400 dashboard-bg-primary rounded-md dashboard-card !shadow-none">
            <CardHeader>
              <CardTitle className="dashboard-text-primary">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="dashboard-text-primary">Email Notifications</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="dashboard-text-primary">SMS Notifications</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="dashboard-text-primary">Appointment Reminders</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Button className="dashboard-button-primary text-primary-white">Save Settings</Button>
      </div>
    </>
  )
}
