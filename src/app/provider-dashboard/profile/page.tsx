"use client"

import { Star, MapPin, Phone, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card"
import { Button } from "@/components/provider-dashboard-ui/button"
import { Badge } from "@/components/provider-dashboard-ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/provider-dashboard-ui/avatar"
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav"

export default function ProfilePage() {
  return (
    <>
      <TopNav title="Profile" subtitle="Manage your professional profile and credentials." notificationCount={2} />

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-text-primary">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Dr. Jane Smith" />
                  <AvatarFallback className="bg-teal-100 text-teal-800 text-xl">JS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold dashboard-text-primary">Dr. Jane Smith</h3>
                  <p className="dashboard-text-secondary">Licensed Physical Therapist</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm dashboard-text-secondary ml-1">4.9 (127 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 dashboard-text-secondary">
                  <Mail className="h-4 w-4" />
                  <span>jane.smith@caregivers.com</span>
                </div>
                <div className="flex items-center gap-2 dashboard-text-secondary">
                  <Phone className="h-4 w-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 dashboard-text-secondary">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-text-primary">Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium dashboard-text-primary">Specializations</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="border-teal-300 text-teal-700">
                    Physical Therapy
                  </Badge>
                  <Badge variant="outline" className="border-teal-300 text-teal-700">
                    Sports Rehabilitation
                  </Badge>
                  <Badge variant="outline" className="border-teal-300 text-teal-700">
                    Geriatric Care
                  </Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium dashboard-text-primary">Experience</h4>
                <p className="dashboard-text-secondary">8 years in physical therapy</p>
              </div>
              <div>
                <h4 className="font-medium dashboard-text-primary">Credentials</h4>
                <div className="space-y-1">
                  <p className="text-sm dashboard-text-secondary">• Licensed Physical Therapist (CA)</p>
                  <p className="text-sm dashboard-text-secondary">• Board Certified in Orthopedic Physical Therapy</p>
                  <p className="text-sm dashboard-text-secondary">• CPR/AED Certified</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium dashboard-text-primary">Languages</h4>
                <p className="dashboard-text-secondary">English, Spanish</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
          <CardHeader>
            <CardTitle className="dashboard-text-primary">Service Areas & Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium dashboard-text-primary mb-2">Service Areas</h4>
                <div className="space-y-1">
                  <p className="text-sm dashboard-text-secondary">• San Francisco, CA</p>
                  <p className="text-sm dashboard-text-secondary">• Oakland, CA</p>
                  <p className="text-sm dashboard-text-secondary">• Berkeley, CA</p>
                  <p className="text-sm dashboard-text-secondary">• Within 25 miles radius</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium dashboard-text-primary mb-2">Hourly Rates</h4>
                <div className="space-y-1">
                  <p className="text-sm dashboard-text-secondary">• Physical Therapy: $85/hour</p>
                  <p className="text-sm dashboard-text-secondary">• Home Visits: $95/hour</p>
                  <p className="text-sm dashboard-text-secondary">• Initial Assessment: $120</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button className="dashboard-button-primary text-primary-white">Edit Profile</Button>
          <Button variant="outline" className="dashboard-button-secondary">
            Update Credentials
          </Button>
        </div>
      </div>
    </>
  )
}
