import request from '@/plugin/axios'
export function getAll (data) {
  return request({
    url: '/user/findUser?username=' + data.username + '&password=' + data.password,
    method: 'post'
  })
}
export function submitall (name, time, thing) {
  return request({
    url: 'user/add',
    method: 'post',
    data: name,
    time,
    thing
  })
}
export function deletems (_id) {
  return request({
    url: 'user/delete',
    method: 'delete'

  })
}
export function updatems (_id, userName, age) {
  return request({
    url: 'user/update/' + _id,
    method: 'put',
    data: {
      userName, age
    }

  })
}
