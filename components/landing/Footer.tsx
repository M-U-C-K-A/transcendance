export function Footer() {
  return (
    <footer className="w-full bg-[#1e1333] text-white py-12 border-t border-pink-500/20">
      <div className="container max-w-6xl px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-pink-500 mb-4">dribbble</h3>
            <p className="text-gray-300 text-sm">
              Creating beautiful digital experiences that help businesses grow and thrive.
            </p>
          </div>

          {[
            {
              title: "Company",
              links: ["About", "Team", "Careers", "Press"],
            },
            {
              title: "Services", 
              links: ["Web Development", "UI/UX Design", "Digital Marketing", "Branding"],
            },
            {
              title: "Contributeurs",
              links: [
                {name: "Hugo", url: "https://profile.intra.42.fr/users/hdelacou"},
                {name: "Robin", url: "https://profile.intra.42.fr/users/rbardet-"},
                {name: "Thomas", url: "https://profile.intra.42.fr/users/throbert"}
              ],
            },
          ].map((column, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {typeof link === 'string' ? (
                      <a href="#" className="text-gray-300 hover:text-pink-400 text-sm transition-colors">
                        {link}
                      </a>
                    ) : (
                      <a 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-gray-300 hover:text-pink-400 text-sm transition-colors"
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

        <div className="mt-12 pt-8 border-t border-pink-500/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Dribbble. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Twitter", "Instagram", "LinkedIn", "GitHub"].map((social) => (
              <a key={social} href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
