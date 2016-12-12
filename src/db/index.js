import AV from 'leancloud-storage'

// 应用 ID，用来识别应用
var appId = 'NvOGnfHo4dnvEo1sK9FNrrHQ-gzGzoHsz';

// 应用 Key，用来校验权限（Web 端可以配置安全域名来保护数据安全）
var appKey = 'Rw1r1w0YHxtMBqGy9wfBgk0u';

// 初始化
AV.init({
  appId,
  appKey,
});

export const av = AV

export const insertOrUpdate = (ClassName, uniqueKeyValuePair, data) => {
  return new Promise((resolve, reject) => {
    var query = new av.Query(ClassName)
    query
      .select(['0'])
      .equalTo(uniqueKeyValuePair[0], uniqueKeyValuePair[1])
      .find()
      .then(
        res => {
          if (res.length === 1) {
            const id = res[0].id
            Object.keys(data)
              .reduce((acc, key) => acc.set(key, data[key]), av.Object.createWithoutData(ClassName, id))
              .save()
              .then(resolve, reject)
          }
          else if (res.length > 1) {
            throw new Error(`The key "${uniqueKeyValuePair[0]}" in Class ${ClassName} is not unique, check it first`)
          }
          else {
            const Obj = av.Object.extend(ClassName)
            const obj = new Obj()
            Object.keys(data)
              .reduce((acc, key) => acc.set(key, data[key]), obj)
              .set(uniqueKeyValuePair[0], uniqueKeyValuePair[1])
              .save()
              .then(resolve, reject)
          }
        },
        reject,
      )
  })
}
