// Remove all  urlParams

//urlParams = []
const removeParams = [
  'director',
  'fileshare',
  'host'
] 

removeParams.forEach((param) => {
  if (urlParams.has(param)) {
    urlParams.delete(param)
  }
})

const appendParam = [
  'view'
]

appendParam.forEach((param) => {
  if (!urlParams.has(param)) {
    urlParams.append(param, '')
  }
})

if (!urlParams.has('room')) {
  urlParams.append('room', 'testroom')
}

