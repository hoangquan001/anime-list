import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Anime mới nhất', href: '/anime/new' },
    { label: 'Top Anime', href: '/top/anime' },
    { label: 'Anime theo mùa', href: '/seasons' },
    { label: 'Random Anime', href: '/random' }
  ]

  const categories = [
    { label: 'Action', href: '/anime/genre/action' },
    { label: 'Romance', href: '/anime/genre/romance' },
    { label: 'Comedy', href: '/anime/genre/comedy' },
    { label: 'Drama', href: '/anime/genre/drama' },
    { label: 'Fantasy', href: '/anime/genre/fantasy' },
    { label: 'Sci-Fi', href: '/anime/genre/sci-fi' }
  ]

  const resources = [
    { label: 'API Documentation', href: '/api-docs' },
    { label: 'Hướng dẫn sử dụng', href: '/help' },
    { label: 'Liên hệ', href: '/contact' },
    { label: 'Báo lỗi', href: '/report' }
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Anime Wiki</h3>
                <p className="text-sm text-gray-400">Khám phá thế giới anime</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Nguồn thông tin anime và manga đáng tin cậy, được cung cấp bởi MyAnimeList API. 
              Khám phá hàng ngàn bộ anime và manga với thông tin chi tiết.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Discord</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.942 3.088c-1.297-.604-2.686-1.048-4.142-1.306a.077.077 0 00-.082.037c-.179.32-.377.739-.515 1.07a15.215 15.215 0 00-4.573 0c-.138-.338-.343-.75-.516-1.07a.08.08 0 00-.082-.037A16.975 16.975 0 003.056 3.09a.073.073 0 00-.034.028C.442 7.605-.264 11.988.082 16.312a.082.082 0 00.031.056c1.71 1.257 3.368 2.02 4.992 2.525a.08.08 0 00.087-.028c.478-.652.904-1.34 1.27-2.061a.077.077 0 00-.042-.107c-.544-.206-1.061-.462-1.549-.762a.078.078 0 01-.008-.129c.104-.078.208-.159.307-.241a.075.075 0 01.078-.01c3.25 1.484 6.771 1.484 9.983 0a.075.075 0 01.079.009c.099.083.203.164.307.242a.078.078 0 01-.006.13c-.489.3-1.006.555-1.55.761a.077.077 0 00-.041.108c.372.718.798 1.408 1.269 2.06a.08.08 0 00.087.028c1.632-.505 3.29-1.268 5-2.525a.08.08 0 00.031-.055c.409-4.99-.685-9.324-2.897-13.168a.063.063 0 00-.033-.029z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Thể loại phổ biến</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link 
                    href={category.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Tài nguyên</h4>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <Link 
                    href={resource.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} Anime Wiki. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              Powered by{' '}
              <a 
                href="https://jikan.moe/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Jikan API
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
