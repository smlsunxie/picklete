import trunk from './trunk'
import exma from './exma'
let production;
try {
  production = require('./production');
} catch (e) {
}

module.exports = {

  database: async () => {
    let force = sails.config.db.force;
    await db.sequelize.sync({force});
  },

  basicData: async () => {
    var roleUser = {
      authority: 'user',
      comment: 'site user'
    };
    let roleUserOptions = {where: {authority: 'user'}, defaults: roleUser}
    var createRoleUser = (await db.Role.findOrCreate(roleUserOptions))[0];


    var roleAdmin = {
      authority: 'admin',
      comment: 'site admin'
    };
    let roleAdminOptions = {where: {authority: 'admin'}, defaults: roleAdmin}
    var createRoleAdmin = (await db.Role.findOrCreate(roleAdminOptions))[0];

    let admin = {
      username: "admin",
      email: "admin@gmail.com",
      mobile: "",
      address: "",
      comment: "",
      RoleId: createRoleAdmin.id
    };
    let userOptions = {where: {username: "admin"}, defaults: admin}
    let createdAdmin = (await db.User.findOrCreate(userOptions))[0];

    let passport = {
      protocol: 'local',
      password: "admin",
      UserId: createdAdmin.id
    };

    let passportOptions = {where: {UserId: createdAdmin.id}, defaults: passport}

    await db.Passport.findOrCreate(passportOptions);

    let like = [
      {title: '我是文具控'},
      {title: '沒有咖啡醒不來'},
      {title: '流浪的迷途，是旅行的終點 喝午茶、聊是非'},
      {title: '給孩子最好的一切'},
      {title: '絕不錯過最新的科技產品！ 妝點居家生活'},
      {title: '音樂是我的靈魂'},
      {title: '享受美學是我的生活態度 寵物就是兒女'},
      {title: '皮革的溫度無法取代'},
      {title: '我總是不小心造成流行 空氣中香味瀰漫'},
      {title: '我運動所以我存在'},
      {title: '呼朋引伴、派對 all night 上班偷逛網購...！'},
      {title: '微醺是種享受、宿醉好想請假'}
    ];

    await db.Like.bulkCreate(like);
    await createdAdmin.setLikes([1, 2, 3, 4, 5]);

    if(sails.config.initData === 'production' && production !== undefined)
      await production.createBasicData();

  },

  // testDate
  testData: async () => {

    if(sails.config.initData){
      if(sails.config.initData === 'trunk')
        await trunk.createTestData();
      if(sails.config.initData === 'exma')
        await exma.createTestData();
    }

    var roleUser = {
      authority: 'user',
      comment: 'site user'
    };
    var createRoleUser = await db.Role.create(roleUser);

    var initAbout = {
      brandVision: '請輸入品牌願景',
      productPhotos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/about.jpg','https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/about.jpg','https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/about.jpg'],
      aboutCompany: '請輸入公司簡介',
      dealerPhotos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/logo-dealers-1.jpg','https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/logo-dealers-1.jpg'],
      dealerNames: ['商店一', '商店二']
    };
    var createAbout = await db.About.create(initAbout);

    var newBuyer = {
      username: "buyer",
      email: "smlsun@gmail.com",
      password: "buyer",
      RoleId: createRoleUser.id,
      comment: "this is a newBuyer",
      orderSyncToken:'11111',
      mobile: '0937397377'
    };
    var createNewBuyer = await db.User.create(newBuyer);

    var newBuyer2 = {
      username: "buyer2",
      email: "buyer2@gmail.com",
      password: "buyer2",
      RoleId: createRoleUser.id,
      comment: "this is newBuyer2"
    };
    var createNewBuyer2 = await db.User.create(newBuyer2);

    var brandExample = [{
      name: '好棒棒品牌',
      avatar: 'http://goo.gl/ksTMyn',
      type: 'PRIME_GOOD',
      desc: 'Steve Aoki 最棒惹',
      banner: 'http://goo.gl/tl4513',
      photos: [
        'http://goo.gl/IRT1EM',
        'http://goo.gl/p9Y2BF'
      ]
    },{
      name: 'Sydney-精選',
      avatar: 'https://goo.gl/XbP9t3',
      type: 'PRIME_GOOD',
      desc: '',
      banner: 'http://goo.gl/tl4513',
      photos: [
      'http://goo.gl/IRT1EM',
      'http://goo.gl/p9Y2BF'
      ]
    }];

    var brand = await db.Brand.bulkCreate(brandExample);


    var brandAgent = [{
      name: '好代理品牌',
      avatar: 'http://goo.gl/ksTMyn',
      type: 'AGENT',
      desc: 'Steve Aoki 最喜歡代理惹',
      banner: 'http://goo.gl/tl4513',
      photos: [
        'http://goo.gl/IRT1EM',
        'http://goo.gl/p9Y2BF'
      ]
    },{
      name: 'Sydney-代理',
      avatar: 'https://goo.gl/XbP9t3',
      type: 'AGENT',
      desc: '',
      banner: 'http://goo.gl/tl4513',
      photos: [
      'http://goo.gl/IRT1EM',
      'http://goo.gl/p9Y2BF'
      ]
    }];

    var otherAgent = {
      name: 'Other',
      avatar: '',
      type: 'OTHER',
      desc: '',
      banner: '',
      photos: []
    };

    var brandAgent = await db.Brand.bulkCreate(brandAgent);

    var otherAgent = await db.Brand.create(otherAgent);

    let FAQTypes = ['會員常見問題','購物常見問題','配送取貨問題','退換貨及退款','發票常見問題','海外會員訂購','產品保養問題'];

    for (let i in FAQTypes){
      var FAQType = await (db.FAQType.create({
        name: FAQTypes[i]
      }));

      for (var j =1; j<3; j++){
        await db.FAQ.create({
          title: 'test' + j,
          answer: '無解',
          FAQTypeId: FAQType.id
        })
      }
    }

    let dpts = ['A', 'B', 'C', 'D', 'E', 'F'];

    for (let i in dpts) {
      var dpt = await (db.Dpt.create({
        name: '館別' + dpts[i],
        weight: i,
        official: true,
      }));

      for (var j=1; j<4; j++) {
        await db.DptSub.create({
          name: '小館-' +  dpts[i] + '-' + j,
          weight: j,
          official: false,
          DptId: dpt.id
        })
      }
    }

    let specialDpt = await db.Dpt.create({
      name: '特別企劃',
      weight: 999,
      official: true,
    });

    var specialSubDpt = ["閃購專區", "優惠商品", "本月主題"];
    for (let i in specialSubDpt) {
      await (db.DptSub.create({
        name: specialSubDpt[i],
        weight: 999,
        official: true,
        DptId: specialDpt.id
      }));
    }

    let createdProductGmComplete, createdProductGmGood;
    let dptA, dptB, dptSubA, dptSubB, noneNameProduct;


    dptA = await db.Dpt.create({
      name: 'test 大館 A',
      weight: 999,
      official: true,
    });

    dptB = await db.Dpt.create({
      name: 'test 大館 B',
      weight: 999,
      official: true,
    });

    dptSubA = await db.DptSub.create({
      name: 'test 小館 A',
      weight: 100,
      official: false
    })

    dptSubB = await db.DptSub.create({
      name: 'test 小館 B',
      weight: 100,
      official: false
    })

    await dptA.setDptSubs(dptSubA);
    await dptB.setDptSubs(dptSubB);

    createdProductGmComplete = await db.ProductGm.create({
      brandId: 1,
      name: "好東西商品",
      explain: '好東西就是要買，買買買',
      usage: '請安心服用',
      notice: '18 歲以下請勿使用',
      depId: dptA.id,
      depSubId: dptSubA.id
    });

    await createdProductGmComplete.setDpts([dptA]);
    await createdProductGmComplete.setDptSubs([dptSubA]);

    createdProductGmGood = await db.ProductGm.create({
      brandId: 1,
      name: "威力棒棒",
      explain: '好棒棒，好棒棒',
      usage: '大口吸，潮爽的',
      notice: '18 歲以下請勿使用',
      depId: dptA.id,
      depSubId: dptSubA.id
    });

    await createdProductGmGood.setDpts([dptA]);
    await createdProductGmGood.setDptSubs([dptSubA]);


    let createdProduct = await db.Product.create({
      name: '超值組',
      description: '讚讚讚',
      stockQuantity: '100',
      isPublish: 'true',
      price: 999,
      size: 'normal',
      service: ["express"],
      country: 'U.K',
      madeby: 'TW',
      color: 3,
      productNumber: '1-USA-2-G',
      spec: 'super-metal'
    });

    await createdProductGmComplete.setProducts(createdProduct);

    noneNameProduct = await db.Product.create({
      stockQuantity: '999',
      isPublish: 'true',
      price: 888,
      size: 'normal',
      service: ["express"],
      country: 'U.K',
      madeby: 'TW',
      color: 3,
      productNumber: '2-USA-3-G',
      spec: 'super-metal'
    });

    await createdProductGmGood.setProducts(noneNameProduct);

    let productNames = ['黃金曼特寧', '夏威夷可娜', '耶加雪夫', '肯亞AA', '巴西喜拉朵', '薇薇特南果', '薩爾瓦多伊莎貝爾', '瓜地馬拉．安提瓜．花神', '星巴克過期豆'];

    for (var i=0; i < productNames.length; i++) {
      await db.Product.create({
        name: productNames[i],
        description: '超級精選' + productNames[i] + '咖啡豆',
        stockQuantity: 1111,
        isPublish: true,
        price: 1399,
        size: 'normal',
        service: ["express"],
        country: 'U.K',
        madeby: 'TW',
        color: 3,
        productNumber: '2-USA-3-G',
        spec: 'super-metal'
      });

      console.log('______--------__________-------------______________');
    }

    // create tag
    let tags = ["男人", "女人", "兒童", "情人", "學生", "寵物", "旅行", "閱讀", "咖啡", "午茶", "派對", "時尚", "印花", "夏日", "冬季", "聖誕", "森林", "動物", "花園", "浪漫", "可愛", "趣味", "復古", "環保", "工業", "簡約"];
    for (let i in tags) {
      await db.Tag.create({
        name: tags[i]
      });
    }
    // end of create tag

    //let isolationLevel = db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
    //let transaction = await db.sequelize.transaction({isolationLevel});

    // Greeting Message to New Buyer
    var mail = CustomMailerService.greeting(newBuyer);
    let msg = await db.Message.create(mail/*, {transaction}*/);
    //transaction.commit();
    CustomMailerService.sendMail(msg);

    //transaction = await db.sequelize.transaction({isolationLevel});

    var sms = SimpleMessageService.greeting(newBuyer);
    msg = await db.Message.create(sms/*, {transaction}*/);
    //transaction.commit();
    SimpleMessageService.send(msg);



    // mock a lot of fake users
    var commonLastNames = ['陳', '林', '黃', '張', '李', '王', '吳', '劉', '蔡', '楊', '許', '鄭', '謝', '郭', '洪', '邱', '曾', '廖', '賴', '徐', '周', '葉', '蘇', '莊', '江', '呂', '何', '羅', '高', '蕭', '潘', '朱', '簡', '鍾', '彭', '游', '詹', '胡', '施', '沈', '余', '趙', '盧', '梁', '顏', '柯', '孫', '魏', '翁', '戴', '范', '宋', '方', '鄧', '杜', '傅', '侯', '曹', '溫', '薛', '丁', '馬', '蔣', '唐', '卓', '藍', '馮', '姚', '石', '董', '紀', '歐', '程', '連', '古', '汪', '湯', '姜', '田', '康', '鄒', '白', '塗', '尤', '巫', '韓', '龔', '嚴', '袁', '鐘', '黎', '金', '阮', '陸', '倪', '夏', '童', '邵', '柳', '錢'];

    var commonFirstNames = ['冠廷', '冠宇', '宗翰', '家豪', '彥廷', '承翰', '柏翰', '宇軒', '家瑋', '冠霖', '雅婷', '雅筑', '怡君', '佳穎', '怡萱', '宜庭', '郁婷', '怡婷', '詩涵', '鈺婷'];

    var randomInt = function (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    };

    var randomDate = function (start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    for (var i=0; i<50; i++) {
      var fakeUser = {
        username: "user" + i,
        fullName: commonLastNames[randomInt(0, commonLastNames.length)] + commonFirstNames[randomInt(0, commonFirstNames.length)],
        birthDate: randomDate(new Date(1930, 0, 1), new Date(2005, 0, 1)),
        email: "user" + i + "@picklete.local",
        password: "0000",
        RoleId: createRoleUser.id,
        comment: "i'm a fake user",
        orderSyncToken: '',
        mobile: '0900'+randomInt(100000, 999999)
      };
      var createFakeUser = await db.User.create(fakeUser);

      var newOrder2 = {
        serialNumber: '00000'+i+1,
        paymentIsConfirmed: true,
        paymentTotalAmount: 1000,
        paymentConfirmDate: randomDate(new Date(2015, 9, 8), new Date(2015, 9, 20)),
        paymentConfirmName:  createFakeUser.fullName,
        paymentConfirmPostfix: '54321',
        quantity: randomInt(0,20),
        orderId: randomInt(1000, 9999),
        UserId: createFakeUser.id,
        ProductId: createdProduct.id
      };
      var createdOrder = await db.Order.create(newOrder2);

      var shipment2 = {
        username: createFakeUser.fullName,
        mobile: createFakeUser.mobile,
        taxId: '123456789',
        email: createFakeUser.email,
        address: '收件者的家',
        OrderId: createdOrder.id
      }
      var createShipment = await db.Shipment.create(shipment2);

      var orderItems2 =[{
        name: '好物三選1',
        description: '好東西，買買買',
        quantity: 1,
        price: 500,
        OrderId: createdOrder.id,
        ProductId: createdProduct.id
      },{
        name: '好物三選2',
        description: '好東西，買買買',
        quantity: 2,
        price: 100,
        OrderId: createdOrder.id,
        ProductId: createdProduct.id
      },{
        name: '好物三選3',
        description: '好東西，買買買',
        quantity: 3,
        price: 200,
        OrderId: createdOrder.id,
        ProductId: createdProduct.id
      }]
      var createOrderItems = await db.OrderItem.bulkCreate(orderItems2);

      var bonuspoint={
        remain: randomInt(0,100),
        used: randomInt(0,500),
        email: createFakeUser.email
      }
      var  createBonusPoints = await db.BonusPoint.create(bonuspoint);

      var additionalPurchase = {
        name: '加價購測試商品'+i ,
        discount: 100 ,
        startDate: randomDate(new Date(2015, 9, 8), new Date(2015, 9, 20)),
        endDate: randomDate(new Date(2015, 9, 21), new Date(2015, 10, 31))
      }

      var createAdditionalPurchase = await db.AdditionalPurchase.create(additionalPurchase);
    }

    // selectionActive
    let images = [
      {
        path: 'http://fakeimg.pl/1100x160',
        url: 'https://github.com'
      },{
        path: 'http://fakeimg.pl/1100x350',
        url: 'https://google.com'
      },{
        path: 'http://fakeimg.pl/545x350',
        url: 'https://yahoo.com'
      },{
        path: 'http://fakeimg.pl/545x350',
        url: ''
      },{
        path: 'http://fakeimg.pl/360x240',
        url: ''
      },{
        path: 'http://fakeimg.pl/360x240',
        url: ''
      },{
        path: 'http://fakeimg.pl/360x240',
        url: ''
      }
    ]
    let createdImages = await* images.map((image) => db.Image.create(image));

    let selectionActives = [
      {
        type: 'oneLong'
      },{
        type: 'oneBig'
      },{
        type: 'two'
      },{
        type: 'three'
      }
    ]
    let createdSelectionActive = await* selectionActives.map((selectionActive) =>
      db.SelectionActive.create(selectionActive)
    );

    await createdSelectionActive[0].setImages([createdImages[0]]);
    await createdSelectionActive[1].setImages([createdImages[1]]);
    await createdSelectionActive[2].setImages([createdImages[2], createdImages[3]]);
    await createdSelectionActive[3].setImages([createdImages[4], createdImages[5], createdImages[6]]);
    // end selectionActive

    // TopicActive
    let topicActives = [{
      title: 'title1',
      ImageAId: createdImages[0].id,
      ImageA1Id: createdImages[1].id,
      ImageA2Id: createdImages[2].id,
      ImageBId: createdImages[0].id,
      ImageB1Id: createdImages[1].id,
      ImageB2Id: createdImages[2].id,
      ImageCId: createdImages[0].id,
      ImageC1Id: createdImages[1].id,
      ImageC2Id: createdImages[2].id
    }, {
      title: 'title2',
      ImageAId: createdImages[3].id,
      ImageA1Id: createdImages[4].id,
      ImageA2Id: createdImages[5].id,
      ImageBId: createdImages[3].id,
      ImageB1Id: createdImages[4].id,
      ImageB2Id: createdImages[5].id,
      ImageCId: createdImages[3].id,
      ImageC1Id: createdImages[4].id,
      ImageC2Id: createdImages[5].id
    }]
    await db.TopicActive.bulkCreate(topicActives);
    // End TopicActive

    // promotions
    var promotion1 = {
      title : 'best price!',
      description : 'this is a test promotion',
      startDate : randomDate(new Date(2015, 9, 8), new Date(2015, 9, 20)),
      endDate : randomDate(new Date(2015, 9, 8), new Date(2016, 9, 20)),
      price : 2999.97,
      type : 'price'
    }
    var promotion2 = {
      title : '50% sale!',
      description : 'this is a test promotion',
      startDate : randomDate(new Date(2015, 9, 8), new Date(2015, 9, 20)),
      endDate : randomDate(new Date(2015, 9, 8), new Date(2016, 9, 20)),
      discount : 0.5,
      type : 'discount'
    }
    var createPromotion1 = await db.Promotion.create(promotion1);
    var createPromotion2 = await db.Promotion.create(promotion2);
    // end promotions


  }
  // end testData
}
