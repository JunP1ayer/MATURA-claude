"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightCircle,
  Users,
  BookOpen,
  Monitor,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Increased Blog Traffic",
    description: "Attract more visitors to your blog with a compelling landing page.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Improved User Engagement",
    description: "Keep visitors engaged with a clean and intuitive design.",
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    title: "Higher Conversion Rates",
    description: "Boost sign-ups and subscriptions with a clear call to action.",
    icon: <Monitor className="h-6 w-6" />,
  },
];

const GeneratedUI = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-sky-500 to-indigo-500 min-h-screen p-4">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">Grow Your Blog Audience</h1>
          <p className="text-lg">
            Attract more readers and boost your blog's reach with our stunning
            landing page.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {feature.icon}
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button
            onClick={() => console.log("View Blog")}
            className="bg-green-500 hover:bg-green-700"
          >
            View Blog <ArrowRightCircle className="ml-2 h-5 w-5" />
          </Button>
          <Button
            onClick={() => console.log("Subscribe")}
            className="ml-4 bg-blue-500 hover:bg-blue-700"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedUI;