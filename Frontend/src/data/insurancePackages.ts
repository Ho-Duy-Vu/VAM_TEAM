/**
 * Mock Insurance Packages Data
 * Sample insurance packages for the application
 */

import type { InsurancePackage } from '../types/insurance'

export const insurancePackages: InsurancePackage[] = [
  // Life Insurance Packages
  {
    id: 'life-basic',
    type: 'life',
    name: 'Bảo Hiểm Nhân Thọ Cơ Bản',
    shortName: 'Nhân Thọ Cơ Bản',
    description: 'Gói bảo hiểm nhân thọ cơ bản, bảo vệ toàn diện cho bạn và gia đình với mức phí hợp lý.',
    price: 2000000,
    period: '1 năm',
    coverage: '500.000.000 VNĐ',
    benefits: [
      'Bồi thường 500 triệu khi tử vong',
      'Bảo vệ tai nạn 24/7',
      'Chi phí y tế tai nạn tối đa 50 triệu',
      'Miễn phí khám sức khỏe định kỳ',
      'Hỗ trợ tang lễ 10 triệu'
    ],
    icon: 'Heart',
    color: 'blue',
    featured: false,
    requiredDocuments: [
      'CMND/CCCD (2 mặt)',
      'Giấy khám sức khỏe (nếu trên 50 tuổi)',
      'Hồ sơ sức khỏe (nếu có bệnh nền)'
    ]
  },
  {
    id: 'life-premium',
    type: 'life',
    name: 'Bảo Hiểm Nhân Thọ Cao Cấp',
    shortName: 'Nhân Thọ VIP',
    description: 'Gói bảo hiểm nhân thọ cao cấp với quyền lợi tối đa, bảo vệ tài chính trọn đời cho gia đình bạn.',
    price: 5000000,
    period: '1 năm',
    coverage: '2.000.000.000 VNĐ',
    benefits: [
      'Bồi thường 2 tỷ khi tử vong',
      'Bảo vệ toàn diện tai nạn, bệnh hiểm nghèo',
      'Chi phí y tế không giới hạn',
      'Thưởng duy trì hợp đồng hàng năm',
      'Hỗ trợ giáo dục con cái',
      'Dịch vụ y tế cao cấp 24/7',
      'Bảo hiểm thương tật vĩnh viễn'
    ],
    icon: 'Shield',
    color: 'purple',
    featured: true,
    requiredDocuments: [
      'CMND/CCCD (2 mặt)',
      'Sổ hộ khẩu',
      'Giấy khám sức khỏe tổng quát',
      'Hồ sơ sức khỏe 5 năm gần nhất',
      'Giấy tờ thu nhập (nếu mua trên 1 tỷ)'
    ]
  },

  // Health Insurance Packages
  {
    id: 'health-family',
    type: 'health',
    name: 'Bảo Hiểm Sức Khỏe Gia Đình',
    shortName: 'Sức Khỏe Gia Đình',
    description: 'Bảo vệ sức khỏe toàn diện cho cả gia đình với mạng lưới bệnh viện rộng khắp.',
    price: 3500000,
    period: '1 năm',
    coverage: '300.000.000 VNĐ/người/năm',
    benefits: [
      'Bảo lãnh viện phí trực tiếp tại 1000+ bệnh viện',
      'Chi phí nội trú, ngoại trú tối đa 300 triệu/người',
      'Thai sản: 30 triệu',
      'Nha khoa: 10 triệu',
      'Khám sức khỏe định kỳ miễn phí',
      'Bảo hiểm tới 6 thành viên gia đình',
      'Dịch vụ cấp cứu 24/7'
    ],
    icon: 'Users',
    color: 'green',
    featured: true,
    requiredDocuments: [
      'CMND/CCCD các thành viên',
      'Sổ hộ khẩu (chứng minh quan hệ)',
      'Giấy khai sinh con (nếu có)',
      'Khai báo sức khỏe ban đầu'
    ]
  },
  {
    id: 'health-international',
    type: 'health',
    name: 'Bảo Hiểm Y Tế Quốc Tế',
    shortName: 'Y Tế Quốc Tế',
    description: 'Gói bảo hiểm y tế cao cấp với phạm vi bảo hiểm toàn cầu, phù hợp cho doanh nhân và người hay đi công tác.',
    price: 8000000,
    period: '1 năm',
    coverage: '5.000.000.000 VNĐ',
    benefits: [
      'Bảo hiểm toàn cầu (trừ Mỹ, Canada)',
      'Điều trị tại các bệnh viện quốc tế hàng đầu',
      'Chi phí không giới hạn cho điều trị nội trú',
      'Vận chuyển y tế khẩn cấp quốc tế',
      'Hỗ trợ đa ngôn ngữ 24/7',
      'Bảo hiểm nha khoa và mắt cao cấp',
      'Điều trị ung thư, bệnh hiểm nghèo'
    ],
    icon: 'Plane',
    color: 'indigo',
    featured: false,
    requiredDocuments: [
      'Hộ chiếu',
      'CMND/CCCD',
      'Hồ sơ sức khỏe toàn diện',
      'Giấy khám sức khỏe quốc tế',
      'Visa/thẻ cư trú (nếu có)'
    ]
  },

  // Vehicle Insurance Packages
  {
    id: 'vehicle-mandatory',
    type: 'vehicle',
    name: 'Bảo Hiểm Xe Bắt Buộc TNDS',
    shortName: 'TNDS Bắt Buộc',
    description: 'Bảo hiểm trách nhiệm dân sự bắt buộc cho chủ xe theo quy định pháp luật.',
    price: 400000,
    period: '1 năm',
    coverage: '150.000.000 VNĐ',
    benefits: [
      'Bồi thường thiệt hại về người: 150 triệu',
      'Bồi thường thiệt hại về tài sản: 100 triệu',
      'Theo quy định Nghị định 03/2021/NĐ-CP',
      'Giấy chứng nhận bảo hiểm điện tử',
      'Hỗ trợ giải quyết bồi thường nhanh chóng'
    ],
    icon: 'Car',
    color: 'orange',
    featured: false,
    requiredDocuments: [
      'CMND/CCCD chủ xe',
      'Đăng ký xe (bản sao)',
      'Giấy phép lái xe'
    ]
  },
  {
    id: 'vehicle-comprehensive',
    type: 'vehicle',
    name: 'Bảo Hiểm Xe Toàn Diện',
    shortName: 'Ô Tô Vật Chất',
    description: 'Bảo hiểm toàn diện cho xe ô tô, bảo vệ cả TNDS và thiệt hại vật chất.',
    price: 3000000,
    period: '1 năm',
    coverage: 'Theo giá trị xe',
    benefits: [
      'Bảo hiểm TNDS bắt buộc',
      'Bảo hiểm vật chất xe (mất cắp, cháy nổ, tai nạn)',
      'Bảo hiểm người ngồi trên xe',
      'Hỗ trợ sửa chữa tại garage ủy quyền',
      'Xe thay thế khi sửa chữa',
      'Cứu hộ miễn phí 24/7',
      'Bồi thường nhanh trong 7 ngày'
    ],
    icon: 'Car',
    color: 'red',
    featured: true,
    requiredDocuments: [
      'CMND/CCCD chủ xe',
      'Đăng ký xe',
      'Giấy phép lái xe',
      'Hóa đơn mua xe (nếu xe mới)',
      'Hình ảnh xe (4 góc)'
    ]
  },

  // Mandatory Health Insurance
  {
    id: 'mandatory-health',
    type: 'mandatory_health',
    name: 'Bảo Hiểm Y Tế Bắt Buộc',
    shortName: 'BHYT Bắt Buộc',
    description: 'Bảo hiểm y tế bắt buộc theo quy định của Nhà nước, hưởng quyền lợi tại các cơ sở y tế công lập.',
    price: 680000,
    period: '1 năm',
    coverage: 'Theo quy định BHXH',
    benefits: [
      'Khám chữa bệnh tại cơ sở đăng ký',
      'Thanh toán 80% chi phí điều trị',
      'Thuốc trong danh mục BHYT',
      'Cấp cứu tại mọi cơ sở y tế',
      'Miễn phí khám bệnh tại tuyến',
      'Theo quy định Luật BHYT 2008'
    ],
    icon: 'LifeBuoy',
    color: 'teal',
    featured: false,
    requiredDocuments: [
      'CMND/CCCD',
      'Sổ hộ khẩu',
      'Ảnh 4x6 (2 ảnh)',
      'Giấy khai sinh (nếu dưới 14 tuổi)'
    ]
  },

  // Natural Disaster Insurance Packages
  {
    id: 'flood-basic',
    type: 'natural_disaster',
    name: 'Bảo Hiểm Thiệt Hại Do Ngập Lụt',
    shortName: 'Bảo Hiểm Ngập Lụt',
    description: 'Bảo vệ tài sản nhà cửa, đồ đạc khỏi thiệt hại do ngập lụt, lũ quét tại các vùng có nguy cơ cao.',
    price: 1500000,
    period: '1 năm',
    coverage: '500.000.000 VNĐ',
    benefits: [
      'Bồi thường thiệt hại nhà cửa do ngập lụt, lũ quét',
      'Bảo hiểm tài sản, đồ đạc trong nhà tối đa 200 triệu',
      'Hỗ trợ chi phí sơ tán khẩn cấp: 10 triệu',
      'Chi phí dọn dẹp, khử trùng sau lũ: 20 triệu',
      'Hỗ trợ tạm trú: 5 triệu/tháng (tối đa 3 tháng)',
      'Giám định nhanh trong 24h sau báo cáo',
      'Thanh toán bồi thường trong 7 ngày làm việc',
      'Hỗ trợ pháp lý miễn phí'
    ],
    icon: 'Droplets',
    color: 'blue',
    featured: true,
    requiredDocuments: [
      'CMND/CCCD chủ hộ',
      'Sổ hộ khẩu',
      'Giấy chứng nhận quyền sử dụng đất/Sổ đỏ',
      'Hình ảnh nhà cửa (4 góc)',
      'Danh sách tài sản cần bảo hiểm',
      'Bản vẽ thiết kế nhà (nếu có)'
    ],
    detailedBenefits: {
      propertyDamage: {
        title: 'Thiệt Hại Tài Sản',
        items: [
          { name: 'Kết cấu nhà', coverage: '500 triệu', description: 'Tường, mái, nền, cột, móng' },
          { name: 'Đồ đạc gia dụng', coverage: '200 triệu', description: 'Tủ lạnh, máy giặt, TV, điều hòa' },
          { name: 'Thiết bị điện tử', coverage: '50 triệu', description: 'Máy tính, điện thoại, máy ảnh' },
          { name: 'Xe máy, xe đạp', coverage: '30 triệu', description: 'Phương tiện cá nhân trong nhà' }
        ]
      },
      emergencySupport: {
        title: 'Hỗ Trợ Khẩn Cấp',
        items: [
          { name: 'Sơ tán khẩn cấp', coverage: '10 triệu', description: 'Chi phí di chuyển, vận chuyển tài sản' },
          { name: 'Tạm trú', coverage: '15 triệu', description: '5 triệu/tháng trong 3 tháng' },
          { name: 'Dọn dẹp, khử trùng', coverage: '20 triệu', description: 'Vệ sinh, tiêu độc sau lũ' },
          { name: 'Hỗ trợ y tế', coverage: '10 triệu', description: 'Chi phí khám chữa bệnh do lũ lụt' }
        ]
      },
      additionalServices: {
        title: 'Dịch Vụ Bổ Sung',
        items: [
          { name: 'Tư vấn phòng chống lũ', coverage: 'Miễn phí', description: 'Hướng dẫn phòng tránh, gia cố nhà cửa' },
          { name: 'Giám định thiệt hại 24/7', coverage: 'Miễn phí', description: 'Đội ngũ giám định tận nơi' },
          { name: 'Hỗ trợ pháp lý', coverage: 'Miễn phí', description: 'Tư vấn thủ tục, hồ sơ bồi thường' },
          { name: 'Hotline khẩn cấp 24/7', coverage: 'Miễn phí', description: '1900-xxxx - Hỗ trợ ngay lập tức' }
        ]
      }
    },
    exclusions: [
      'Thiệt hại do chiến tranh, bạo loạn',
      'Ngập úng do hệ thống thoát nước kém',
      'Nhà cửa đã xuống cấp nghiêm trọng trước khi mua bảo hiểm',
      'Tài sản không được khai báo trong hợp đồng',
      'Thiệt hại gián tiếp (mất thu nhập, lợi nhuận)'
    ]
  },
  {
    id: 'storm-comprehensive',
    type: 'natural_disaster',
    name: 'Bảo Hiểm Thiệt Hại Do Bão',
    shortName: 'Bảo Hiểm Bão',
    description: 'Bảo vệ toàn diện tài sản khỏi thiệt hại do bão, gió lốc, sét đánh tại khu vực ven biển và miền Trung.',
    price: 2000000,
    period: '1 năm',
    coverage: '800.000.000 VNĐ',
    benefits: [
      'Bồi thường thiệt hại do bão từ cấp 8 trở lên',
      'Bảo hiểm nhà cửa, kết cấu: tối đa 800 triệu',
      'Tài sản, đồ đạc: tối đa 300 triệu',
      'Thiệt hại do sét đánh, gió lốc',
      'Cây cối đổ gây thiệt hại: 50 triệu',
      'Hỗ trợ sửa chữa khẩn cấp: 100 triệu',
      'Chi phí tạm trú: 10 triệu/tháng (tối đa 6 tháng)',
      'Ưu tiên giám định trong vòng 12h'
    ],
    icon: 'Wind',
    color: 'cyan',
    featured: true,
    requiredDocuments: [
      'CMND/CCCD chủ hộ',
      'Sổ hộ khẩu',
      'Sổ đỏ/Giấy chứng nhận quyền sử dụng đất',
      'Hình ảnh nhà cửa từ 4 hướng',
      'Bản vẽ thiết kế, giấy phép xây dựng',
      'Hóa đơn mua sắm tài sản giá trị cao (nếu có)'
    ],
    detailedBenefits: {
      propertyDamage: {
        title: 'Thiệt Hại Tài Sản',
        items: [
          { name: 'Mái nhà bị tốc', coverage: '300 triệu', description: 'Mái ngói, mái tôn, kèo, xà gồ' },
          { name: 'Tường, cửa sổ vỡ', coverage: '200 triệu', description: 'Tường bao, cửa kính, cửa sắt' },
          { name: 'Hệ thống điện', coverage: '50 triệu', description: 'Dây điện, cầu dao, ổ cắm hỏng' },
          { name: 'Đồ đạc bên trong', coverage: '300 triệu', description: 'Nội thất, thiết bị gia dụng' }
        ]
      },
      emergencySupport: {
        title: 'Hỗ Trợ Khẩn Cấp',
        items: [
          { name: 'Sửa chữa tạm thời', coverage: '100 triệu', description: 'Che chắn, gia cố khẩn cấp' },
          { name: 'Tạm trú dài hạn', coverage: '60 triệu', description: '10 triệu/tháng trong 6 tháng' },
          { name: 'Dọn dẹp hiện trường', coverage: '30 triệu', description: 'Thu dọn mảnh vỡ, cây đổ' },
          { name: 'An toàn điện nước', coverage: '20 triệu', description: 'Sửa chữa hệ thống điện nước' }
        ]
      },
      additionalServices: {
        title: 'Dịch Vụ Bổ Sung',
        items: [
          { name: 'Cảnh báo bão sớm', coverage: 'Miễn phí', description: 'SMS, app thông báo trước 48h' },
          { name: 'Tư vấn gia cố nhà cửa', coverage: 'Miễn phí', description: 'Chuyên gia hướng dẫn phòng tránh' },
          { name: 'Đội cứu hộ 24/7', coverage: 'Miễn phí', description: 'Hỗ trợ trong và sau bão' },
          { name: 'Bảo hiểm tạm thời miễn phí', coverage: 'Miễn phí', description: 'Gia hạn thêm 30 ngày nếu bão kéo dài' }
        ]
      }
    },
    exclusions: [
      'Bão dưới cấp 8',
      'Nhà tạm, nhà dột nát đã xuống cấp',
      'Thiệt hại do thi công xây dựng không đúng chuẩn',
      'Mưa thông thường, không có bão',
      'Thiệt hại do lũ lụt (cần mua gói riêng)'
    ]
  },
  {
    id: 'disaster-vehicle',
    type: 'natural_disaster',
    name: 'Bảo Hiểm Phương Tiện Thiên Tai',
    shortName: 'Xe Thiên Tai',
    description: 'Bảo vệ xe ô tô, xe máy khỏi thiệt hại do ngập nước, bão, lũ, cây đổ với quy trình bồi thường nhanh.',
    price: 1200000,
    period: '1 năm',
    coverage: 'Theo giá trị xe',
    benefits: [
      'Bồi thường 100% giá trị xe khi ngập nước sâu',
      'Sửa chữa động cơ, hộp số do ngập: tối đa 200 triệu',
      'Thiệt hại do cây đổ, vật rơi: tối đa 100 triệu',
      'Cứu hộ xe khẩn cấp 24/7 miễn phí',
      'Xe thay thế trong thời gian sửa chữa',
      'Bảo dưỡng miễn phí sau sửa chữa',
      'Không tính khấu hao phụ tùng thay thế',
      'Bồi thường trong 5 ngày làm việc'
    ],
    icon: 'CloudRain',
    color: 'slate',
    featured: true,
    requiredDocuments: [
      'CMND/CCCD chủ xe',
      'Đăng ký xe (bản gốc hoặc sao y)',
      'Giấy phép lái xe',
      'Hình ảnh xe từ 4 góc + số khung, số máy',
      'Hóa đơn mua xe (nếu xe mới dưới 1 năm)',
      'Biên bản giám định xe (nếu xe cũ)'
    ],
    detailedBenefits: {
      propertyDamage: {
        title: 'Thiệt Hại Phương Tiện',
        items: [
          { name: 'Động cơ ngập nước', coverage: '200 triệu', description: 'Sửa chữa hoặc thay mới động cơ' },
          { name: 'Hộp số, hệ thống điện', coverage: '100 triệu', description: 'Hỏng hóc do ngập úng' },
          { name: 'Nội thất xe', coverage: '50 triệu', description: 'Ghế, thảm, hệ thống âm thanh' },
          { name: 'Kính, đèn vỡ', coverage: '30 triệu', description: 'Do cây đổ, vật rơi, mưa đá' }
        ]
      },
      emergencySupport: {
        title: 'Hỗ Trợ Khẩn Cấp',
        items: [
          { name: 'Cứu hộ 24/7', coverage: 'Miễn phí', description: 'Kéo xe, cứu hộ tại chỗ' },
          { name: 'Xe thay thế', coverage: 'Miễn phí', description: 'Trong thời gian sửa chữa (tối đa 30 ngày)' },
          { name: 'Vệ sinh, khử trùng xe', coverage: 'Miễn phí', description: 'Sau khi ngập nước' },
          { name: 'Kiểm tra an toàn', coverage: 'Miễn phí', description: 'Đảm bảo xe hoạt động tốt sau sửa' }
        ]
      },
      additionalServices: {
        title: 'Dịch Vụ Bổ Sung',
        items: [
          { name: 'Cảnh báo ngập úng', coverage: 'Miễn phí', description: 'App thông báo điểm ngập trong thành phố' },
          { name: 'Tư vấn lưu giữ xe', coverage: 'Miễn phí', description: 'Hướng dẫn đỗ xe an toàn khi có bão' },
          { name: 'Garage ủy quyền', coverage: 'Miễn phí', description: 'Sửa chữa tại 500+ garage toàn quốc' },
          { name: 'Bảo hành sửa chữa', coverage: '6 tháng', description: 'Đảm bảo chất lượng sửa chữa' }
        ]
      }
    },
    exclusions: [
      'Vượt lũ, lái xe vào vùng ngập sâu cố tình',
      'Xe đang di chuyển khi ngập (không tắt máy kịp)',
      'Thiệt hại do bảo dưỡng, sửa chữa kém',
      'Xe không có bảo hiểm TNDS còn hiệu lực',
      'Hư hỏng cơ học thông thường, không do thiên tai'
    ]
  }
]

// Helper functions
export const getPackageById = (id: string): InsurancePackage | undefined => {
  return insurancePackages.find(pkg => pkg.id === id)
}

export const getPackagesByType = (type: string): InsurancePackage[] => {
  return insurancePackages.filter(pkg => pkg.type === type)
}

export const getFeaturedPackages = (): InsurancePackage[] => {
  return insurancePackages.filter(pkg => pkg.featured)
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}
