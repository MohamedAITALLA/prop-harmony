
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property } from '@/types/api-responses';
import { PropertyType } from '@/types/enums';

// Mock data and components for demonstration
const mockProperty: Property = {
  _id: "prop-1",
  name: "Beachfront Villa",
  property_type: PropertyType.VILLA,
  address: {
    street: "123 Ocean Drive",
    city: "Malibu",
    stateProvince: "CA",
    postalCode: "90210",
    country: "USA"
  },
  accommodates: 8,
  bedrooms: 4,
  bathrooms: 3.5,
  images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop"],
  description: "A beautiful beachfront villa with stunning views."
};

export default function ComponentsDemo() {
  return (
    <div className="space-y-10 p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UI Components</h1>
        <p className="text-muted-foreground">
          This page showcases various UI components used in the application.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Forms Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Component</CardTitle>
              </CardHeader>
              <CardContent>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="cabin">Cabin</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            {/* Additional form components would go here */}
          </div>
        </section>

        {/* Data Display Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Data Display</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scroll Area</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72 rounded-md border p-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Property Details</h4>
                    <p>Name: {mockProperty.name}</p>
                    <p>Type: {mockProperty.property_type}</p>
                    <p>Location: {mockProperty.address.city}, {mockProperty.address.country}</p>
                    <p>Accommodates: {mockProperty.accommodates} guests</p>
                    <p>Bedrooms: {mockProperty.bedrooms}</p>
                    <p>Bathrooms: {mockProperty.bathrooms}</p>
                    <h4 className="text-sm font-medium pt-4">Description</h4>
                    <p>{mockProperty.description}</p>
                    <h4 className="text-sm font-medium pt-4">Address</h4>
                    <p>{mockProperty.address.street}</p>
                    <p>{mockProperty.address.city}, {mockProperty.address.stateProvince} {mockProperty.address.postalCode}</p>
                    <p>{mockProperty.address.country}</p>
                    <div className="h-20"></div> {/* Extra space to demonstrate scrolling */}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Additional data display components would go here */}
          </div>
        </section>

        {/* Mock Property Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Property Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Example Property 1</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>Oceanfront Villa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span>Villa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>Malibu, USA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Bedrooms:</span>
                    <span>4</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Example Property 2</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>Mountain Cabin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span>Cabin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>Aspen, USA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Bedrooms:</span>
                    <span>2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
