import Image from 'next/image';
import { LandingPageStep } from '@repo/store';

const defaultSteps = [
  {
    id: 1,
    title: 'Sign Up in 2 Minutes',
    description:
      'Create your account, set your DJ name, and choose your plan. No credit card required for Starter.',
    imageUrl: '/home/feature/Feature1.png',
  },
  {
    id: 2,
    title: 'Customise Your Website',
    description:
      'Pick a theme, add your bio, upload your mixes, and set your booking rates — your brand, your way.',
    imageUrl: '/home/feature/Feature2.png',
  },
  {
    id: 3,
    title: 'Share & Get Booked',
    description:
      'Share your unique link everywhere. Clients visit, fill a booking form, and you confirm in your dashboard.',
    imageUrl: '/home/feature/Feature3.png',
  },
];

interface HowItWorksProps {
  steps?: LandingPageStep[];
}

export default function HowItWorks({ steps }: HowItWorksProps) {
  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <section className="bg-[#f0f0f0] py-24 px-6" id="howitworks">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#111620] mb-4">
            Get live in <span className="text-primary">3 simple</span> steps
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From zero to a fully running DJ business online — in under an hour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displaySteps.map((step, index) => (
            <div key={step.id || index} className="bg-white flex flex-col shadow-sm">
              <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
                {step.imageUrl ? (
                  <Image
                    src={step.imageUrl}
                    alt={step.title || 'Step'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="text-gray-400 font-bold text-4xl">{index + 1}</div>
                )}
              </div>
              <div className="p-8 flex flex-col grow">
                <h3 className="text-xl font-bold text-[#111620] mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
