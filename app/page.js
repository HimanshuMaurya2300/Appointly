import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Clock, LinkIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Testimonials from '@/components/Testimonials'



const features = [
  {
    icon: Calendar,
    title: "Create Events",
    description: "Easily set up and customize your event types",
  },
  {
    icon: Clock,
    title: "Manage Availability",
    description: "Define your availability to streamline scheduling",
  },
  {
    icon: LinkIcon,
    title: "Custom Links",
    description: "Share your personalized scheduling link",
  },
];

const howItWorks = [
  { step: "Sign Up", description: "Create your free Appointly account" },
  {
    step: "Set Availability",
    description: "Define when you're available for meetings",
  },
  {
    step: "Share Your Link",
    description: "Send your scheduling link to clients or colleagues",
  },
  {
    step: "Get Booked",
    description: "Receive confirmations for new appointments automatically",
  },
];

const Home = () => {
  return (
    <main className='container mx-auto px-4 py-16'>
      <div className='flex flex-col lg:flex-row items-center justify-between gap-12 mb-24'>
        <div className='lg:w-1/2'>
          <h1 className='text-7xl font-extrabold pb-6 gradient-title'>
            Simplify your Scheduling
          </h1>
          <p className='text-xl text-gray-600 mb-10'>
            Appointly helps you manage your time effectively. Create events, set your availability, and let others book time with you seamlessly.
          </p>
          <Link href='/dashboard'>
            <Button size='lg' className='text-lg'>
              Get Started <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
        </div>
        <div className='lg:w-1/2 flex justify-center'>
          <div className='relative w-full max-w-md aspect-square'>
            <Image
              src="/poster.png"
              alt="poster"
              layout='fill'
              objectFit='contain'
            />
          </div>
        </div>
      </div>

      <div className='mb-24'>
        <h2 className='text-3xl font-bold text-center mb-12 text-blue-600'>Key Features</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-500 mb-4 mx-auto" />
                <CardTitle className='text-center text-blue-600'>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-center text-gray-600'>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className='mb-24'>
        <h2 className='text-3xl font-bold text-center mb-12 text-blue-600'>
          What Our Users Are Saying
        </h2>
        <Testimonials />
      </div>

      <div className='mb-24'>
        <h2 className='text-3xl font-bold text-center mb-12 text-blue-600'>
          How It Works
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {howItWorks.map((step, index) => (
            <div key={index} className="text-center">
              <div className='bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                <span className='text-blue-600 font-bold text-xl'>
                  {index + 1}
                </span>
              </div>
              <h3 className='font-semibold text-lg mb-2'>
                {step.step}
              </h3>
              <p className='text-gray-600'>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-blue-600 text-white rounded-lg p-8 text-center'>
        <h2 className='text-3xl font-bold mb-4'>
          Ready to Simpligy your Scheduling?
        </h2>
        <p className='text-xl mb-6'>
          Join thousands of professionals who trust appointly for efficient time management
        </p>
        <Link href={'/dashboard'}>
          <Button size='lg' variant='secondary' className='text-blue-600'>
            Start for free <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
        </Link>
      </div>
    </main>
  )
}

export default Home