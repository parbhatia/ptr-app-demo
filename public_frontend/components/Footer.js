const footerItems = [
  // {
  //   href: "https://google.com",
  //   label: "Github",
  //   icon: "",
  //   local: false, //to indicate whether to render Nextjs Link
  // },
]

const FooterItem = ({ href, label }) => <div>{label}</div>

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-5 mb-5 ml-3 mr-3 text-xs font-thin tracking-tighter text-center text-gray-500">
      <div className="flex justify-center">
        {footerItems.map(({ href, label }, i) => (
          <FooterItem key={`footeritem-${i}`} href={href} label={label} />
        ))}
      </div>
      <div className="flex justify-center">
        © Home Inspection Services. All Rights Reserved.
      </div>
    </div>
  )
}

export default Footer
