import { Code, Smartphone, Database, Palette, TrendingUp, Globe } from 'lucide-react';

const programs = [
  {
    icon: Code,
    title: 'Kỹ thuật phần mềm',
    description: 'Đào tạo kỹ sư phần mềm chuyên nghiệp với khả năng phát triển ứng dụng quy mô lớn',
    duration: '4 năm',
    opportunities: 'Software Engineer, Full-stack Developer, DevOps Engineer',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Smartphone,
    title: 'Thiết kế đồ họa',
    description: 'Sáng tạo và thiết kế các sản phẩm đồ họa chuyên nghiệp cho thị trường quốc tế',
    duration: '4 năm',
    opportunities: 'UI/UX Designer, Graphic Designer, Creative Director',
    gradient: 'from-pink-500 to-pink-600',
  },
  {
    icon: Database,
    title: 'Trí tuệ nhân tạo',
    description: 'Nghiên cứu và phát triển các giải pháp AI, Machine Learning cho doanh nghiệp',
    duration: '4 năm',
    opportunities: 'AI Engineer, Data Scientist, ML Researcher',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: Globe,
    title: 'An ninh mạng',
    description: 'Chuyên gia bảo mật thông tin, bảo vệ hệ thống và dữ liệu doanh nghiệp',
    duration: '4 năm',
    opportunities: 'Security Analyst, Ethical Hacker, Security Architect',
    gradient: 'from-red-500 to-red-600',
  },
  {
    icon: TrendingUp,
    title: 'Kinh doanh số',
    description: 'Kết hợp công nghệ và kinh doanh để xây dựng các mô hình kinh doanh hiện đại',
    duration: '4 năm',
    opportunities: 'Digital Marketer, Business Analyst, Product Manager',
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    icon: Palette,
    title: 'Thiết kế trò chơi',
    description: 'Sáng tạo và phát triển các trò chơi điện tử chất lượng cao cho thị trường toàn cầu',
    duration: '4 năm',
    opportunities: 'Game Designer, 3D Artist, Game Developer',
    gradient: 'from-purple-500 to-purple-600',
  },
];

export default function Programs() {
  return (
    <section id="programs" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Các{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Ngành học
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chương trình đào tạo đa dạng, đáp ứng nhu cầu của thị trường lao động công nghệ 4.0
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent hover:-translate-y-2"
            >
              <div className={`bg-gradient-to-br ${program.gradient} p-8 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <program.icon className="h-12 w-12 text-white mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
                  {program.title}
                </h3>
                <div className="text-white/90 text-sm relative z-10">
                  Thời gian: {program.duration}
                </div>
              </div>

              <div className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {program.description}
                </p>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-900">
                    Cơ hội nghề nghiệp:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {program.opportunities.split(', ').map((opportunity, i) => (
                      <span
                        key={i}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full"
                      >
                        {opportunity}
                      </span>
                    ))}
                  </div>
                </div>

                <button className={`mt-6 w-full bg-gradient-to-r ${program.gradient} text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-3xl p-12 border border-orange-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Chưa chắc chắn về ngành học?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Đội ngũ tư vấn của chúng tôi sẵn sàng hỗ trợ bạn tìm ra ngành học phù hợp nhất với đam mê và năng lực
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              Đặt lịch tư vấn miễn phí
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
