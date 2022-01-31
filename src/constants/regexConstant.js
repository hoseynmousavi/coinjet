const regexConstant = {
    emoji: /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi,
    pair: /pair:(\w{3,4})\/(\w{3,4})/,
    leverage: /leverage:(\d*)x/,
    entry: /entry:(\d|\.|-)*/,
    target: /target:(\d|\.|-)*/,
    stop: /stop:(\d*)/,
}

export default regexConstant