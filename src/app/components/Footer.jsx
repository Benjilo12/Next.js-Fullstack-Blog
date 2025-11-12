import Image from "next/image";
import Link from "next/link";

const footer_data = [
  {
    title: "Quick Links",
    links: [
      { name: "Home", path: "/" },
      { name: "Blogs", path: "/blog" },
      { name: "Contact Us", path: "/contact" }, // Fixed path
      { name: "Faq", path: "/faq" }, // Fixed path
    ],
  },
  {
    title: "Need Help",
    links: [
      { name: "Contact Us", path: "/contact" },
      { name: "Faq", path: "/faq" },
      { name: "Privacy", path: "/privacy" },
      { name: "Advertise with Us", path: "/" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { name: "Instagram", url: "https://instagram.com/topblog" },
      { name: "X.com", url: "https://x.com/topblog" },
      { name: "Facebook", url: "https://facebook.com/topblog" },
      { name: "YouTube", url: "https://youtube.com/topblog" },
    ],
  },
];

function Footer() {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
        <div>
          <Link
            href="/"
            className="flex flex-row text-black text-2xl dark:text-gray-400 "
          >
            <Image
              src="/Topz.png"
              alt="logo"
              width={45}
              height={35}
              className="md:w-10 mr-1.5 md:h-10 md:mt-3 dark:bg-gray-900 w-9 h-9"
            />
            <span className=" text-emerald-600 text-[19px] mt-2 md:mt-4 md:text-[27px] font-bold">
              <span className="text-cyan-600 ">Top</span>Blog
            </span>
          </Link>
          <p className=" text-gray-600 text-[14px] md:text-[15px] max-w-[410px] mt-3 dark:text-gray-400 leading-6">
            This is my space to think out loud, share what matters to me, and
            write straight from the heart. Whether it&apos;s a fleeting thought
            or a deeper dive, my story unfolds right here. I&apos;m glad
            you&apos;re along for the journey.
          </p>
        </div>
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-8">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 dark:text-gray-300">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.path ? (
                      <Link
                        href={link.path}
                        className=" flex flex-col md:mb-3 hover:underline transition dark:hover:text-emerald-400 text-gray-700 dark:text-gray-400 hover:text-blue-600"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline transition dark:hover:text-emerald-400 text-gray-700 dark:text-gray-400 hover:text-blue-600 mb-4"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-center text-[12px] md:text-md text-gray-500/80 dark:text-gray-400">
        Copyright 2025 @TopBlog - All Right Reserved
      </p>
    </div>
  );
}

export default Footer;
