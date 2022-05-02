const regexConstant = {
    emoji: /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi,
    pair: /pair:(\w{3,5})\/(\w{3,5})/,
    risk: /risk:(\d|.)*%/,
    leverage: /leverage:(\d*)/,
    entries: /entries:(\d|\.|\n|\(|\)|%)*\)/,
    targets: /targets:(\d|\.|\n|\(|\)|%)*\)/,
    entry_target_index: /^\d*\./,
    entry_target_percent: /\(\d{0,2}%\)/,
    stop: /stoploss:(\d|\.)*/,
}

export default regexConstant