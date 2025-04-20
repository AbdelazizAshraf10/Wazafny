import React from "react";

function CompanyAbout() {
  return (
    <div >
      
        {/* Overview Content */}
        <div className="p-4 sm:p-8">
          <h3 className="text-xl font-bold mb-4">About</h3>
          <p className="text-gray-700 text-base leading-7">
            The Vodafone Tech Innovation Center Dresden is Vodafone’s new global
            center for innovation and co-creation with other top tech world-wide
            companies, universities and research institutes. The scope of this
            new hub is to improve people’s lives by innovating communications
            and empower businesses for a digital and sustainable future.
          </p>
          <p className="text-gray-700 text-base leading-7 mt-4">
            We use newest technologies such as 5G, 6G, Augmented Reality,
            Artificial Intelligence, Data Analytics and Security Design in order
            to build new products and propositions for health, industry,
            transport, automotive, agriculture and many more.
          </p>
          <p className="text-gray-700 text-base leading-7 mt-4">
            Dresden is a dynamically growing high tech region in the heart of
            Europe with a strong industrial focus, excellent research landscape.
            At the same time Dresden is a great place to live with manifold
            culture, unspoiled nature and an international and family friendly
            environment. The ideal spot for creativity and innovation.
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Industry</h3>
            <p className="text-gray-700 text-base">Telecommunications</p>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Company size</h3>
            <p className="text-gray-700 text-base">201-500 employees</p>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Headquarters</h3>
            <p className="text-gray-700 text-base">Dresden, Saxony</p>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Founded</h3>
            <p className="text-gray-700 text-base">2021</p>
          </div>
        </div>
      
    </div>
  );
}

export default CompanyAbout;
