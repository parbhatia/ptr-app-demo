const Descriptor = ({ title, description }) => (
  <div>
    <div className="flex justify-center text-2xl font-bold lg:text-4xl">
      {title}
    </div>
    <div className="text-sm tracking-tight text-center text-gray-600 md:text-lg sm:mx-auto md:mx-28">
      {description}
    </div>
  </div>
)

export default Descriptor
