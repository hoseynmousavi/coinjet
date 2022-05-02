const telegramConstant = {
    welcomeMsg: "به کوین‌جت خوش آمدید!\n" +
        "دیگر لازم نیست نگران از دست دادن سیگنال‌های خوب باشید و وقت زیادی صرف بررسی قیمت و ثبت سفارش کنید.\n" +
        "با استفاده از بات کوین‌جت می‌توانید حساب صرافی‌تان را به کانال سیگنال‌دهی محبوب خود متصل کنید تا کوین‌جت برای شما به صورت خودکار معامله کند.\n" +
        "کوین‌جت به هیچ وجه امکان برداشت از حساب شما را ندارد و اطلاعات دارایی‌های شما را نیز تنها به خودتان نمایش می‌دهد.",
    welcomeAddExchange: "در ادامه می‌توانید حساب صرافی‌های خود را به حساب کوین‌جت متصل کنید.\n",
    chooseExchangesForAdd: "از میان صرافی‌های زیر که ما آن‌ها را پشتیبانی می‌کنیم یکی را انتخاب کنید:",
    chooseExchangesForRemove: "لطفا حسابی که مایل به حذف آن هستید را انتخاب کنید:",
    youDontHaveUserExchange: "شما حساب صرافی ندارید.",
    removeUserExchangeDone: "حذف حساب صرافی با موفقیت انجام شد.",
    removeUserExchangeErr: "در حذف حساب صرافی مشکلی پیش آمد، بعدا دوباره تلاش کنید.",
    userExchange404: "شما حسابی با این نام ندارید.",
    sendYourCredentialsAndName: "برای اینکه بتوانید حساب‌های صرافی خود را از هم تفکیک کنید باید برای حساب خود نامی انتخاب کنید\n" +
        "همچنین لازم است به بخش اتصال API در حساب صرافی خود بروید و یک API جدید بسازید. اطلاعات API ساخته شده را به شکل زیر در اینجا وارد کنید:\n" +
        "Name, API Key, API Secret, API Passphrase\n" +
        "مثال:\n" +
        "MyKuCoin, 92640192872398752395, 9w8fysdfoghdf, cocococo",
    exchangeCompleted: "اطلاعات شما با موفقیت ثبت شد.\nHappy Trading 🙂",
    noUnCompletedExchange: "اطلاعات حساب صرافی‌های شما از قبل کامل است.",
    repeatedUserExchangeName: "نامی که انتخاب کردید تکراری است. نام دیگری انتخاب کنید.",
    notOk: "مفهوم پیام شما نامشخص است!",
    removeExchange: "Remove: ",
    overviewExchange: "Overview: ",
    positionsExchange: "My Positions: ",
    ordersExchange: "My Orders: ",
    userExchangeSpot: " (spot)",
    userExchangeFutures: " (futures)",
    connectionSucceed: "با موفقیت به اکانت شما متصل شدیم.",
    connectionFail: "در اتصال به اکانت شما با خطا مواجه شدیم.\n",
    signalFoundButNoBalance: "سیگنال جدیدی دریافت شد اما به دلیل کمبود موجودی حسابتان، سفارشی ثبت نشد.",
    signalFoundButNoCoinSupport: "سیگنال جدیدی دریافت شد اما صرافی کوکوین آن را ساپورت نمی‌کند.",
    signalFoundButErr: "سیگنال جدیدی دریافت شد اما در بارگزاری آن در صرافی، مشکلاتی پیش آمد.",
    signalFoundAndOrdersCreated: ({isFutures, ordersCount, isShort}) => `سیگنال ${isFutures ? "فیوچرز" : "اسپات"} جدیدی دریافت شد و ${ordersCount} اردر${!isFutures ? "" : isShort ? " short" : " long"} گذاشته شد.`,
    entryOrderFilledAndStopAdded: ({entryIndex}) => `انتری ${entryIndex}م سیگنال fill شد، اردر استاپ گذاشته شد.`,
    entryOrderFilledAndStopFailed: ({entryIndex}) => `انتری ${entryIndex}م سیگنال fill شد، اما در بارگزاری اردر استاپ مشکلی پیش آمد.`,
    entryOrderFilledAndTPsAdded: ({entryIndex, tpCount}) => `انتری ${entryIndex}م سیگنال fill شد، اردر ${tpCount} اردر tp گذاشته شد.`,
    entryOrderFilledAndTPsFailed: ({entryIndex}) => `انتری ${entryIndex}م سیگنال fill شد، اما در بارگزاری اردرهای tp مشکلی پیش آمد.`,
    stopSignalAndTpOrdersRemoved: "سیگنال متوقف شد، اردرهای tp پاک شدند.",
    tpFilledAndDone: "آخرین اردر tp فیل شد! اردرها با موفقیت تمام شدند.",
    tpFilledAndStopUpdated: ({tpIndex}) => `اردر ${tpIndex}م tp فیل شد! اردر استاپ آپدیت شد.`,
    tpFilledAndStopFailed: ({tpIndex}) => `اردر ${tpIndex}م tp فیل شد! اما در آپدیت اردر استاپ مشکلی پیش آمد.`,
}

export default telegramConstant