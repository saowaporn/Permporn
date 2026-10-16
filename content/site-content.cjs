// Public website copy derived from source-documents/01.md–10.md.
// Tuples contain Thai first, English second. No inventory is implied.
module.exports = {
  collections: [
    { id: 'natural-diamonds', source: '02', image: 'natural', name: ['เพชรธรรมชาติ', 'Natural diamonds'], intro: ['เพชรธรรมชาติ คัดสรรให้เหมาะกับความต้องการของคุณ', 'Natural diamonds, sourced around you'], copy: ['จัดหาเพชรธรรมชาติหลากหลายรูปทรงและขนาด โดยพิจารณาคุณภาพ งบประมาณ และวัตถุประสงค์การใช้งาน เพื่อช่วยให้คุณเปรียบเทียบตัวเลือกก่อนตัดสินใจ', 'We source natural diamonds across a range of shapes and sizes, considering quality, budget, and intended use to present suitable options for comparison.'], short: ['คัดเลือกตามรูปทรง คุณภาพ และงบประมาณ พร้อมช่วยเปรียบเทียบ 4Cs', 'Selected by shape, quality, and budget, with clear 4Cs comparisons.'] },
    { id: 'lab-grown-diamonds', source: '03', image: 'lab', name: ['เพชรแล็บ', 'Lab-grown diamonds'], intro: ['เพชรแล็บ ในรูปทรงและขนาดที่คุณเลือก', 'Lab-grown diamonds, shaped around your preferences'], copy: ['เพชรแล็บ (Lab-Grown Diamonds) เติบโตในสภาพแวดล้อมควบคุม มีองค์ประกอบทางเคมีและโครงสร้างผลึกเช่นเดียวกับเพชรธรรมชาติ เราช่วยจัดหา เปรียบเทียบคุณสมบัติและรายงานการจัดระดับก่อนยืนยันคำสั่งซื้อ', 'Lab-grown diamonds are created in controlled environments, with the same chemical composition and crystal structure as natural diamonds. We help source and compare specifications and grading reports before order confirmation.'], short: ['เลือกทรงและน้ำหนักที่ต้องการ พร้อมข้อมูลประเภทเพชรอย่างชัดเจน', 'Explore shapes and carat weights, with the diamond type clearly disclosed.'] },
    { id: 'colored-gemstones', source: '04', image: 'gemstones', name: ['พลอยสี', 'Colored gemstones'], intro: ['สีสันและเอกลักษณ์ ที่เลือกให้เหมาะกับคุณ', 'Color and character, thoughtfully selected'], copy: ['ค้นพบพลอยสีหลากหลายชนิด ทั้งหยก ทับทิม ไพลิน มรกต และพลอยสีอื่น ๆ เราคัดสรรตามสี รูปทรง ขนาด คุณภาพ และงบประมาณ พร้อมประสานงานออกแบบเครื่องประดับสั่งทำ', 'Explore jade, ruby, sapphire, emerald, and other colored gemstones. We source by color, shape, size, quality, and budget, with custom jewelry coordination available.'], short: ['หยก ทับทิม ไพลิน มรกต และพลอยอื่น ๆ คัดสรรตามสีและลักษณะที่ชอบ', 'Jade, ruby, sapphire, emerald, and more, sourced for your preferred color and character.'] },
    { id: 'custom-jewelry', source: '05', image: 'custom', name: ['เครื่องประดับสั่งทำ', 'Custom jewelry'], intro: ['จากไอเดียของคุณ สู่เครื่องประดับชิ้นพิเศษ', 'From your idea to a personal piece'], copy: ['ออกแบบและประสานงานผลิตแหวน ต่างหู จี้ และสร้อย เลือกเพชร พลอยสี และวัสดุตัวเรือนให้เหมาะกับสไตล์และงบประมาณ เราช่วยประสานงานตั้งแต่การปรึกษาเบื้องต้นจนถึงการตรวจสอบงานก่อนส่งมอบ', 'We coordinate design and production for rings, earrings, pendants, and necklaces. Choose a diamond or gemstone and suitable metal to match your style and budget, from consultation through final quality review.'], short: ['เลือกเม็ด ตัวเรือน และวัสดุ พร้อมพิจารณาแบบก่อนเริ่มผลิต', 'Choose your stone, setting, and metal, and review the design before production.'] }
  ],
  shapes: [
    ['Round', 'กลม', 'Round brilliant'], ['Oval', 'วงรี', 'Oval'], ['Emerald', 'เอเมอรัลด์คัต', 'Emerald'], ['Cushion', 'คุชชั่น', 'Cushion'], ['Radiant', 'เรเดียนท์', 'Radiant'], ['Pear', 'หยดน้ำ', 'Pear'], ['Marquise', 'มาร์คีส์', 'Marquise'], ['Princess', 'พรินเซส', 'Princess'], ['Heart', 'หัวใจ', 'Heart']
  ],
  criteria: [
    ['Carat', 'น้ำหนักเพชรเป็นกะรัต', 'Diamond weight in carats'],
    ['Color', 'ระดับสีตามใบรายงาน', 'Color grade as reported'],
    ['Clarity', 'ระดับความสะอาดตามใบรายงาน', 'Clarity grade as reported'],
    ['Cut', 'คุณภาพการเจียระไน ตามขอบเขตที่รายงานระบุ', 'Cut grade within the scope of the report'],
    ['Measurements', 'ขนาดเป็นมิลลิเมตร เพื่อพิจารณาสัดส่วนและตัวเรือน', 'Dimensions in millimeters to consider proportions and setting'],
    ['Report', 'สถาบันและเลขรายงานเมื่อมี ยืนยันเป็นรายเม็ด', 'Issuing laboratory and report number, confirmed per stone where available']
  ],
  gemstones: [
    {id:'jade', name:['หยก','Jade'], copy:['สำหรับจี้ แหวน กำไล และงานสั่งทำ ตรวจสอบชนิด Jadeite หรือ Nephrite และข้อมูลการปรับปรุงคุณภาพเป็นรายชิ้น','For pendants, rings, bangles, and custom work. Jadeite or nephrite identification and disclosed treatments are verified per item.']},
    {id:'ruby', name:['ทับทิม','Ruby'], copy:['หลากหลายเฉดสีแดงและรูปทรง พิจารณาความงาม คุณภาพ และข้อมูลการปรับปรุงคุณภาพของแต่ละเม็ด','A variety of red tones and cuts, with attention to appearance, quality, and disclosed treatments.']},
    {id:'sapphire', name:['ไพลิน','Sapphire'], copy:['ไพลินสีน้ำเงินและแฟนซีแซฟไฟร์ในเฉดสีอื่น ๆ สำหรับเลือกเป็นเม็ดเดี่ยวหรืองานเครื่องประดับ','Blue and fancy-color sapphires for individual stones or bespoke jewelry projects.']},
    {id:'emerald', name:['มรกต','Emerald'], copy:['มรกตสีเขียวหลากหลายขนาดและรูปทรง ให้ความสำคัญกับลักษณะภายในเนื้อพลอยและข้อมูลการปรับปรุงคุณภาพ','Green emeralds across different sizes and cuts, considering inclusions and treatment disclosures.']},
    {id:'spinel', name:['สปิเนล','Spinel'], copy:['มีให้เลือกทั้งสีแดง ชมพู ม่วง และน้ำเงิน สำหรับแหวน จี้ หรืองานสั่งทำ คัดเลือกตามเฉดสี รูปทรง และงบประมาณที่ต้องการ','Available in red, pink, purple, and blue for rings, pendants, or custom pieces, sourced for your preferred shade, cut, and budget.']},
    {id:'other', name:['พลอยสีอื่น ๆ','Other gemstones'], copy:['ทัวร์มาลีน อะความารีน แทนซาไนต์ และซิทริน ตามความพร้อมของแหล่งจัดหา','Tourmaline, aquamarine, tanzanite, and citrine, subject to sourcing availability.']}
  ],
  customTypes: [
    {id:'rings', name:['แหวน','Rings'], copy:['แหวนหมั้น แหวนเพชร แหวนพลอยสี และแหวนแฟชั่น เลือกเม็ดกลาง รูปแบบตัวเรือน และวัสดุที่เหมาะกับแบบ','Engagement, diamond, gemstone, and statement rings. Select the center stone, setting style, and suitable metal.']},
    {id:'earrings', name:['ต่างหู','Earrings'], copy:['แบบเม็ดเดี่ยว แบบห้อย และแบบคู่ พร้อมช่วยคัดคู่เพชรหรือพลอยให้พิจารณาก่อนผลิต','Studs, drops, and pairs, with matching diamonds or gemstones sourced for review before production.']},
    {id:'pendants', name:['จี้','Pendants'], copy:['จี้เพชร จี้พลอย และจี้ตัวอักษร เลือกรูปทรง ขนาด และห่วงจี้ให้เหมาะกับการใช้งาน','Diamond, gemstone, and personalized pendants, with suitable shapes, dimensions, and practical bail designs.']},
    {id:'necklaces', name:['สร้อย','Necklaces'], copy:['เลือกความยาวสาย วัสดุ และรูปแบบให้เหมาะกับจี้และการสวมใส่','Choose chain length, metal, and design to suit the pendant and how you wear it.']}
  ],
  steps: [
    {title:['แจ้งความต้องการ','Tell us what you need'], copy:['แจ้งประเภทสินค้า รูปทรง ขนาด งบประมาณ และวันที่ต้องการ พร้อมภาพอ้างอิงหากมี','Share the item type, shape, size, budget, required date, and any reference images.']},
    {title:['พิจารณาตัวเลือก','Review options'], copy:['พิจารณาเพชร พลอย หรือแนวทางออกแบบ พร้อมข้อมูลที่ตรวจสอบได้และใบรายงานเมื่อมี','Review suitable stones or design directions with available supporting information and reports.']},
    {title:['ยืนยันรายละเอียดและราคา','Confirm details and quote'], copy:['ตรวจสอบสินค้า วัสดุ ขนาด ราคา เงื่อนไขชำระเงิน และกำหนดเวลาโดยประมาณก่อนยืนยัน','Review specifications, metal, dimensions, price, payment terms, and estimated timing before confirmation.']},
    {title:['จัดหาหรือประสานงานผลิต','Sourcing or production'], copy:['ดำเนินการจัดหา หรือประสานงานออกแบบและผลิตตามรายละเอียดและแบบที่ได้รับอนุมัติ','We coordinate sourcing or custom design and production according to the approved specifications.']},
    {title:['ตรวจสอบและส่งมอบ','Final review and delivery'], copy:['ตรวจรายละเอียดสินค้าและเอกสารที่ตกลงกัน พร้อมนัดรับหรือจัดส่งตามข้อตกลง','We review the agreed item details and documents, then arrange collection or delivery.']}
  ],
  customSteps: [
    {title:['เล่าไอเดียและงบประมาณ','Share your idea and budget'],copy:['แจ้งประเภทชิ้นงาน แบบที่ชอบ ขนาด และรูปอ้างอิง','Tell us the piece type, preferred design, dimensions, and reference images.']},
    {title:['เลือกเม็ดและวัสดุ','Choose the stone and metal'],copy:['เปรียบเทียบเพชรหรือพลอย พร้อมวัสดุตัวเรือนที่เหมาะกับแบบ','Compare diamonds or gemstones and metals suitable for your design.']},
    {title:['พิจารณาแบบและใบเสนอราคา','Review design and quotation'],copy:['พิจารณาแบบร่างหรือ CAD พร้อมรายละเอียดและราคา','Review sketches or CAD, specifications, and quotation.']},
    {title:['อนุมัติแบบก่อนผลิต','Approve before production'],copy:['ยืนยันแบบ ขนาด วัสดุ และเงื่อนไขเป็นลายลักษณ์อักษร','Confirm design, dimensions, materials, and terms in writing.']},
    {title:['ตรวจงานและนัดส่งมอบ','Review and arrange delivery'],copy:['ประสานงานผลิต ตรวจงาน และนัดรับหรือจัดส่งตามตกลง','Coordinate production, quality review, and agreed collection or delivery.']}
  ],
  services: [
    {name:['จัดหาเพชร','Diamond sourcing'],copy:['จัดหาเพชรธรรมชาติและเพชรแล็บตามรูปทรง น้ำหนัก สี ความสะอาด งบประมาณ และความต้องการด้านใบรายงาน โดยตรวจข้อมูลรายเม็ดก่อนเสนอ','Natural and lab-grown diamonds sourced by shape, carat, color, clarity, budget, and report requirements, reviewed against available documentation.'],link:'natural-diamonds'},
    {name:['จัดหาพลอยสี','Colored gemstone sourcing'],copy:['คัดเลือกชนิด สี ขนาด รูปทรง และข้อมูลแหล่งที่มาหรือการปรับปรุงคุณภาพเท่าที่มีหลักฐาน','Source by gem type, color, size, and cut, with origin and treatment information where documented.'],link:'colored-gemstones'},
    {name:['ช่วยเปรียบเทียบตัวเลือก','Selection and comparison'],copy:['เปรียบเทียบคุณลักษณะ ราคา ใบรายงาน และระยะเวลาจัดหา พร้อมอธิบายรายละเอียดและข้อจำกัดก่อนตัดสินใจ','Compare specifications, quotations, available reports, and estimated sourcing time, with relevant details and limitations explained.'],link:'contact'},
    {name:['ออกแบบและประสานงานผลิต','Custom jewelry coordination'],copy:['ประสานงานพัฒนาแบบ 3D เลือกวัสดุ ตัวเรือน และการผลิตกับผู้เชี่ยวชาญตามรายละเอียดที่ตกลง','Coordinate design development, 3D modeling, metal selection, settings, and production with specialist partners as agreed.'],link:'custom-jewelry'}
  ],
  values: [
    {name:['เริ่มจากการรับฟัง','We start by listening'],copy:['เข้าใจชนิดเม็ด แบบที่ชอบ โอกาสใช้งาน และงบประมาณของคุณ','Understand your stone preferences, design, intended use, and budget.']},
    {name:['คัดสรรและเปรียบเทียบ','Source and compare'],copy:['คัดเลือกตัวเลือกที่เหมาะสมจากข้อมูลที่มี พร้อมให้คุณพิจารณา','Shortlist suitable options using available information for your review.']},
    {name:['ข้อมูลที่ช่วยตัดสินใจ','Information you can use'],copy:['อธิบายสเปก รายงานที่มี และสิ่งที่ควรพิจารณาก่อนยืนยัน','Share specifications, available reports, and considerations before confirmation.']},
    {name:['ประสานงานเป็นรายชิ้น','Coordination for each piece'],copy:['ประสานงานออกแบบและผลิตกับผู้เชี่ยวชาญตามลักษณะงาน','Coordinate design and production with relevant specialists for each project.']}
  ],
  faq: [
    {
      "group": "products",
      "q": [
        "เพิ่มพรให้บริการอะไรบ้าง?",
        "What products and services do you offer?"
      ],
      "a": [
        "เพิ่มพรช่วยจัดหาเพชรธรรมชาติ เพชรแล็บ และพลอยสี รวมถึงประสานงานออกแบบและสั่งทำเครื่องประดับ เช่น แหวน ต่างหู จี้ และสร้อย คุณสามารถสอบถามเฉพาะเม็ดเพชรหรือพลอย หรือให้ช่วยดูทั้งเม็ดและตัวเรือนร่วมกันได้\n\nเริ่มต้นโดยบอกสิ่งที่กำลังมองหา งบประมาณ และวันที่ต้องการใช้ หากมีรูปแบบที่ชอบ ส่งเป็นภาพอ้างอิงผ่านช่องทางติดต่อได้ ทีมงานจะช่วยค้นหาและเปรียบเทียบตัวเลือก พร้อมอธิบายรายละเอียดที่ตรวจสอบได้ก่อนให้คุณตัดสินใจ\n\nบางรายการต้องจัดหาเฉพาะคำขอ จึงควรสอบถามความพร้อมและระยะเวลาก่อน การส่งฟอร์มหรือข้อความเป็นการเริ่มพูดคุย ยังไม่ใช่การยืนยันสั่งซื้อ",
        "We help source natural diamonds, lab-grown diamonds, and colored gemstones, and coordinate custom rings, earrings, pendants, and necklaces. You can enquire about a loose stone or discuss a stone and setting together.\n\nTell us what you are looking for, your budget, and when you need it. Reference images can be shared through our contact channels. We will help explore suitable options and explain the available details before you decide.\n\nSome items are sourced specifically upon request, so please check availability and timing. Sending an enquiry starts a conversation; it does not confirm an order."
      ]
    },
    {
      "group": "products",
      "q": [
        "สินค้าทุกชิ้นมีใบรายงานหรือไม่?",
        "Does every item come with a report?"
      ],
      "a": [
        "ไม่ใช่สินค้าทุกชิ้นจะมีใบรายงาน ขึ้นอยู่กับชนิดและรายการที่เลือก หากรายการนั้นมีเอกสาร ทีมงานจะแจ้งชื่อสถาบัน หมายเลขรายงาน และรายละเอียดที่เกี่ยวข้องให้ตรวจสอบก่อนยืนยันซื้อ\n\nใบรายงานช่วยให้ดูข้อมูลของเม็ดนั้นได้ชัดขึ้น เช่น ประเภท รูปทรง น้ำหนัก และคุณลักษณะที่สถาบันระบุ หากมีข้อมูลส่วนใดที่อ่านไม่เข้าใจ สามารถส่งคำถามให้ทีมงานช่วยอธิบายและเปรียบเทียบกับตัวเลือกอื่นได้\n\nหากคุณต้องการใบรายงานจากสถาบันใดเป็นพิเศษ เช่น GIA หรือ IGI แจ้งตั้งแต่เริ่มสอบถาม เพื่อให้ทีมงานตรวจสอบว่ามีตัวเลือกที่ตรงกับความต้องการหรือไม่ อย่าสรุปจากภาพสินค้าเพียงอย่างเดียวว่ามีเอกสารแนบมาด้วย",
        "Not every item comes with a laboratory report. Documentation depends on the stone and the particular item. Where a report is available, we provide the issuing laboratory, report number, and relevant details before purchase confirmation.\n\nA report helps you review the characteristics recorded for that stone, such as its type, shape, weight, and other information assessed by the laboratory. Ask us to explain unfamiliar entries or compare the available information between options.\n\nIf a particular laboratory, such as GIA or IGI, matters to you, mention it in your first enquiry so we can check suitable options. A product image alone does not indicate that a report is included."
      ]
    },
    {
      "group": "products",
      "q": [
        "เพชรธรรมชาติกับเพชรแล็บต่างกันอย่างไร?",
        "How do natural and lab-grown diamonds differ?"
      ],
      "a": [
        "ทั้งสองเป็นเพชร แต่มีแหล่งกำเนิดต่างกัน เพชรธรรมชาติก่อตัวในธรรมชาติ ส่วนเพชรแล็บเติบโตในสภาพแวดล้อมที่ควบคุมได้ เราจะแจ้งประเภทให้ชัดเจนในรายละเอียดและใบเสนอราคา เพื่อให้คุณเลือกได้ตรงกับความต้องการ\n\nการเลือกไม่ได้ดูแค่แหล่งกำเนิด ควรพิจารณารูปทรง น้ำหนัก สี ความสะอาด การเจียระไน และข้อมูลใบรายงานที่มีของแต่ละเม็ดร่วมกัน เม็ดที่น้ำหนักเท่ากันจึงอาจมีรายละเอียดและราคาต่างกันได้\n\nหากยังไม่แน่ใจ บอกงบประมาณและสิ่งที่ให้ความสำคัญ เช่น ต้องการเพชรธรรมชาติ หรืออยากเปรียบเทียบขนาดกับงบที่มี ทีมงานจะช่วยอธิบายตัวเลือกทั้งสองประเภทก่อนตัดสินใจ",
        "Both are diamonds, but their origins differ. Natural diamonds form in nature, while lab-grown diamonds grow in controlled environments. We identify the type in the item details and quotation so you know which option you are considering.\n\nOrigin is only one part of the choice. Review shape, carat weight, color, clarity, cut, and available report information together. Two stones of the same weight can therefore have different specifications and prices.\n\nIf you are undecided, share your budget and priorities, such as a preference for natural origin or a wish to compare size within your budget. We can help explain both options before you choose."
      ]
    },
    {
      "group": "ordering",
      "q": [
        "กำหนดงบประมาณและรูปทรงได้ไหม?",
        "Can I specify a budget and shape?"
      ],
      "a": [
        "ได้ คุณกำหนดงบประมาณ รูปทรง น้ำหนักหรือขนาด และลักษณะเครื่องประดับที่ชอบได้ หากต้องการสั่งทำทั้งชิ้น ควรแจ้งว่างบที่ระบุรวมตัวเรือนด้วยหรือเป็นงบสำหรับเม็ดเพชรหรือพลอยอย่างเดียว เพื่อให้เปรียบเทียบได้ตรงกัน\n\nไม่จำเป็นต้องรู้ศัพท์หรือสเปกครบทุกข้อ คุณอาจเริ่มจากคำง่าย ๆ เช่น “อยากได้แหวนทรงวงรี ใช้ทุกวัน งบประมาณ 50,000 บาท” หรือส่งภาพแบบที่ชอบ แล้วให้ทีมงานช่วยถามรายละเอียดส่วนที่ยังขาด\n\nในหน้าเพชร กดรูปทรงที่ชอบเพื่อไปฟอร์มสอบถามได้เลย ระบบจะเลือกหมวดและรูปทรงไว้ให้ จากนั้นเลือกการัต กรอกงบประมาณ และระบุสิ่งที่สำคัญกับคุณในช่องรายละเอียดเพิ่มเติม",
        "Yes. You can specify your budget, preferred shape, weight or dimensions, and jewelry style. For a complete custom piece, tell us whether the budget includes the setting or covers only the stone, so the options are compared on the same basis.\n\nYou do not need to know every technical term. For example, you could ask for an oval ring for daily wear with a budget of THB 50,000, or share a reference image. We can help clarify the remaining details.\n\nOn a diamond page, select a shape to open the enquiry form with the collection and shape already filled in. Choose a carat weight, enter your budget, and explain your priorities under Additional details."
      ]
    },
    {
      "group": "ordering",
      "q": [
        "ใช้เวลาจัดหาหรือสั่งทำนานเท่าไร?",
        "How long does sourcing or production take?"
      ],
      "a": [
        "ระยะเวลาขึ้นอยู่กับความพร้อมของเม็ดเพชรหรือพลอย ความซับซ้อนของแบบ การยืนยันรายละเอียด และคิวผู้ผลิต จึงต้องประเมินเป็นรายคำสั่งซื้อ แทนการใช้จำนวนวันเดียวกับทุกชิ้น\n\nงานจัดหาเม็ดเดี่ยวกับงานสั่งทำตัวเรือนมีขั้นตอนต่างกัน งานสั่งทำอาจต้องมีช่วงพัฒนาแบบ เลือกวัสดุ และอนุมัติรายละเอียดก่อนเริ่มผลิต หากมีการแก้แบบ ระยะเวลาโดยประมาณอาจต้องปรับตามขั้นตอนที่เพิ่มขึ้น\n\nหากต้องใช้ในวันหมั้น วันแต่งงาน หรือวันสำคัญ แจ้งวันที่ตั้งแต่เริ่มสอบถาม ทีมงานจะตรวจสอบความเป็นไปได้และแจ้งกำหนดเวลาประเมินก่อนยืนยันคำสั่งซื้อ ควรยืนยันกำหนดส่งมอบร่วมกับรายละเอียดงานเป็นลายลักษณ์อักษร",
        "Timing depends on stone availability, design complexity, specification approvals, and the production schedule. We estimate each project individually rather than apply one fixed lead time to every item.\n\nLoose-stone sourcing and a custom setting involve different steps. Custom work may include design development, metal selection, and approval before production begins. Design changes can affect the estimated schedule.\n\nIf the piece is needed for an engagement, wedding, or another occasion, provide the date at the start. We will check feasibility and discuss an estimated timeline before you confirm. Record the delivery arrangements together with the agreed specifications in writing."
      ]
    },
    {
      "group": "ordering",
      "q": [
        "ดูสินค้าจริงหรือนัดหมายได้หรือไม่?",
        "Can I view items or arrange an appointment?"
      ],
      "a": [
        "ติดต่อเพื่อนัดหมายล่วงหน้าได้ครับ โดยการชมสินค้าจริงขึ้นอยู่กับความพร้อมของรายการและสถานที่นัดหมายที่ยืนยันแล้ว การกดส่งฟอร์มไม่ได้จองเวลาเข้าพบให้อัตโนมัติ\n\nก่อนนัดหมาย แจ้งชนิดสินค้า รูปทรงหรือแบบที่สนใจ งบประมาณ และวันเวลาที่สะดวก เพื่อให้ทีมงานตรวจสอบว่ามีรายการใดให้พิจารณาได้ และต้องเตรียมข้อมูลหรือจัดหาเพิ่มเติมก่อนหรือไม่\n\nเมื่อทีมงานยืนยันวัน เวลา และสถานที่แล้ว จึงวางแผนเดินทางได้ คุณเปิดแผนที่จากหน้าติดต่อเพื่อดูเส้นทางได้ หากต้องเลื่อนนัดหรือเปลี่ยนรายการที่อยากดู กรุณาแจ้งล่วงหน้าเพื่อให้เตรียมการได้เหมาะสม",
        "You can contact us to arrange an appointment. In-person viewing depends on item availability and a confirmed meeting location. Sending a form does not automatically reserve an appointment.\n\nTell us the item type, preferred shape or design, budget, and convenient dates. This lets the team check which items can be considered and whether further information or sourcing is needed beforehand.\n\nPlease travel only after the date, time, and location have been confirmed. The contact page includes a map for directions. Let us know in advance if you need to reschedule or change the items you wish to discuss."
      ]
    },
    {
      "group": "payment",
      "q": [
        "ราคาบนเว็บไซต์เป็นราคาสุดท้ายหรือไม่?",
        "Are website prices final?"
      ],
      "a": [
        "ราคาหรือช่วงราคาที่อาจแสดงบนเว็บไซต์ใช้เป็นข้อมูลประกอบการพิจารณา ราคาสำหรับสั่งซื้อจริงจะอยู่ในใบเสนอราคาฉบับล่าสุดที่ยืนยันรายละเอียดตรงกันแล้ว\n\nราคาอาจต่างกันตามชนิดและสเปกของเม็ด วัสดุและแบบตัวเรือน รวมถึงวันที่เสนอราคา หากเปลี่ยนขนาด คุณภาพ หรือรายละเอียดงาน ควรให้ทีมงานตรวจสอบและเสนอราคาใหม่ก่อนตัดสินใจ\n\nก่อนยืนยัน ให้ตรวจว่ายอดที่เสนอครอบคลุมรายการใดบ้าง เช่น เม็ดเพชรหรือพลอย ตัวเรือน และค่าใช้จ่ายอื่นที่ตกลง พร้อมสอบถามระยะเวลาที่ราคานั้นมีผล เพื่อให้ทราบยอดและเงื่อนไขครบถ้วนก่อนชำระ",
        "Any price or range shown on the website is for initial guidance. The order price is stated in the latest quotation with the agreed specifications.\n\nPrices can differ with the stone type and specifications, setting material and design, and quotation date. If you change size, quality, or design details, ask the team to review and update the quotation before deciding.\n\nCheck what the total includes, such as the stone, setting, and any other agreed charges. Also ask how long the quotation remains valid, so the amount and conditions are clear before payment."
      ]
    },
    {
      "group": "payment",
      "q": [
        "ชำระเงินอย่างไร?",
        "How do I pay?"
      ],
      "a": [
        "เมื่อได้รายละเอียดงานที่ตรงกันแล้ว ทีมงานจะแจ้งวิธีชำระเงิน ยอดมัดจำหากมี และกำหนดชำระเป็นลายลักษณ์อักษรในใบเสนอราคาหรือใบยืนยันคำสั่งซื้อ จำนวนเงินและจุดชำระอาจต่างกันตามลักษณะงาน\n\nก่อนโอน ตรวจชื่อผู้รับเงิน ยอดเงิน และข้อมูลคำสั่งซื้อกับช่องทางทางการของเพิ่มพร หากข้อมูลไม่ตรงหรือมีการแจ้งเปลี่ยนบัญชี ควรติดต่อยืนยันก่อนชำระ สามารถติดต่อผ่านช่องทางในหน้าติดต่อของเว็บไซต์ได้\n\nหลังชำระ เก็บหลักฐานและแจ้งทีมงานเพื่อให้ตรวจสอบยอด พร้อมสอบถามขั้นตอนถัดไปของงาน หากยังไม่เข้าใจรายละเอียดการชำระหรือยอดใด ควรสอบถามให้ชัดก่อนโอน",
        "Once the specifications are agreed, the team provides payment methods, any deposit, and payment milestones in writing in the quotation or order confirmation. Amounts and stages depend on the project.\n\nBefore transferring funds, verify the payee, amount, and order details through Permporn's official contact channels. If anything differs or you receive a change of account details, confirm it before paying. Use the channels listed on our contact page.\n\nKeep your payment record and notify the team so the amount can be checked and the next step explained. Ask about any unclear amount or payment condition before making a transfer."
      ]
    },
    {
      "group": "support",
      "q": [
        "ต้องการเปลี่ยนแบบหรือยกเลิก ทำอย่างไร?",
        "Can I change or cancel an order?"
      ],
      "a": [
        "แจ้งทีมงานโดยเร็ว พร้อมรายละเอียดคำสั่งซื้อและสิ่งที่ต้องการเปลี่ยน เช่น รูปทรง ขนาดตัวเรือน วัสดุ หรือแบบเครื่องประดับ เพื่อให้ตรวจสอบสถานะงานก่อนดำเนินการต่อ\n\nทางเลือกจะขึ้นอยู่กับว่างานอยู่ขั้นตอนไหน เช่น ยังอยู่ระหว่างคุยแบบ เริ่มจัดหาเม็ดแล้ว หรือเริ่มผลิตตัวเรือนแล้ว ทีมงานจะตรวจสอบว่าสามารถปรับได้อย่างไร มีค่าใช้จ่ายเกิดขึ้นหรือไม่ และกระทบกำหนดส่งมอบอย่างไร\n\nเงื่อนไขการยกเลิกและคืนเงินต้องดูข้อตกลงของงานนั้น จึงไม่ควรสรุปว่าทุกรายการเปลี่ยนหรือยกเลิกได้เหมือนกัน ขอให้ยืนยันรายละเอียดและค่าใช้จ่ายที่เกี่ยวข้องเป็นลายลักษณ์อักษรก่อนตกลงปรับงาน",
        "Contact the team promptly with your order details and the requested change, such as the stone shape, ring size, metal, or design, so the current stage can be checked before further work proceeds.\n\nOptions depend on whether the project is still in design discussions, stone sourcing has begun, or the setting is already in production. The team will review what can be adjusted, any costs already incurred, and the effect on timing.\n\nCancellation and refund arrangements depend on the terms for that order; they are not identical for every project. Confirm the revised details and any related costs in writing before agreeing to a change."
      ]
    },
    {
      "group": "support",
      "q": [
        "มีบริการหลังการขายหรือไม่?",
        "Is after-sales support available?"
      ],
      "a": [
        "หากพบปัญหาเกี่ยวกับสินค้า สามารถติดต่อทีมงานเพื่อให้ตรวจสอบได้ แจ้งว่าเป็นชิ้นใด ได้รับเมื่อใด และพบปัญหาอย่างไร พร้อมภาพที่เห็นบริเวณปัญหาชัดเจน หากมีหลักฐานคำสั่งซื้อ เตรียมไว้ประกอบการตรวจสอบด้วย\n\nทีมงานจะพิจารณารายละเอียดและแจ้งแนวทางที่เหมาะสมตามลักษณะงานและข้อตกลง บางกรณีอาจต้องตรวจชิ้นงานจริงก่อน จึงจะประเมินวิธีแก้ไข ค่าใช้จ่าย หรือระยะเวลาได้\n\nขอบเขตและระยะเวลารับประกันต้องยืนยันสำหรับแต่ละคำสั่งซื้อ ไม่ได้ใช้เงื่อนไขเดียวกับสินค้าทุกชิ้น หากมีคำถามเรื่องการใช้งานหรือดูแลรักษาชิ้นงานที่ได้รับ สามารถสอบถามพร้อมแจ้งชนิดเม็ดและวัสดุตัวเรือน เพื่อให้คำแนะนำตรงกับชิ้นงาน",
        "If you experience an issue, contact the team and identify the piece, when it was received, and what happened. Clear photographs of the affected area and any order records help us review the situation.\n\nWe will assess the details and explain suitable next steps according to the project and agreed terms. In some cases, the piece may need an in-person assessment before a remedy, cost, or timeframe can be estimated.\n\nWarranty scope and duration must be confirmed for each order; there is no single stated policy covering every item. For use or care questions, tell us the stone type and setting material so advice can relate to your piece."
      ]
    }
  ]
};
