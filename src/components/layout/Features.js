'use client';

export default function Features() {
    const features = [
      {
        icon: "🌱",
        title: "Data Collection",
        description: "Easily collect and track farming data across multiple fields and seasons."
      },
      {
        icon: "📊",
        title: "Analytics",
        description: "Gain valuable insights through comprehensive data analysis and visualization."
      },
      {
        icon: "🤝",
        title: "Collaboration",
        description: "Connect and collaborate with researchers and policymakers worldwide."
      },
      {
        icon: "🔍",
        title: "Research Access",
        description: "Access the latest agricultural research and apply it to your farming practices."
      }
    ];
  
    return (
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#3d4852] mb-12">Our Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#3d4852] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }