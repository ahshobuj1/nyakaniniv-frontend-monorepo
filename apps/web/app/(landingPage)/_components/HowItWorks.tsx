import Image from 'next/image';

const steps = [
  {
    id: 1,
    title: 'Sign Up in 2 Minutes',
    description:
      'Create your account, set your DJ name, and choose your plan. No credit card required for Starter.',
    image: '/home/feature/Feature1.png',
  },
  {
    id: 2,
    title: 'Customise Your Website',
    description:
      'Pick a theme, add your bio, upload your mixes, and set your booking rates — your brand, your way.',
    image: '/home/feature/Feature2.png',
  },
  {
    id: 3,
    title: 'Share & Get Booked',
    description:
      'Share your unique link everywhere. Clients visit, fill a booking form, and you confirm in your dashboard.',
    image: '/home/feature/Feature3.png',
  },
];

export default function HowItWorks() {
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
          {steps.map((step) => (
            <div key={step.id} className="bg-white flex flex-col shadow-sm">
              <div className="relative w-full h-64">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
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
