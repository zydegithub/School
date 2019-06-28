<template>
  <table style="border-collapse:separate; border-spacing:10px;">
    <tr>
      <td width="44px"></td>
      <td>用户名:</td>
      <td>
        <el-input v-model="username" placeholder="用户名" style="width:226px" @blur="isHave()"></el-input>
      </td>
      <td></td>
    </tr>

    <tr>
      <td></td>
      <td>密码:</td>
      <td>
        <el-input v-model="password" type="password" placeholder="密码" style="width:226px"></el-input>
      </td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td>确定密码:</td>
      <td>
        <el-input v-model="truePassword" type="password" placeholder="确定密码" style="width:226px"></el-input>
      </td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td>昵称:</td>
      <td>
        <el-input v-model="name" placeholder="昵称" style="width:226px"></el-input>
      </td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td>出生日期:</td>
      <td>
        <el-date-picker v-model="birthday" type="date" placeholder="选择日期时间"></el-date-picker>
      </td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td>性别:</td>
      <td>
        <el-radio-group v-model="sex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td>头像:</td>
      <td>
        <el-upload
          class="upload-pic"
          :action="domain"
          :data="QiniuData"
          :on-remove="handleRemove"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          :before-remove="beforeRemove"
          :before-upload="beforeAvatarUpload"
          :limit="3"
          multiple
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">选择图片</el-button>
        </el-upload>
        <div>
          <img class="pic-box" :src="uploadPicUrl" v-if="uploadPicUrl">
        </div>
      </td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td>个性签名:</td>
      <td>
        <el-input type="textarea" v-model="signature"></el-input>
      </td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td>
        <el-button style="float:right" :loading="loading" @click="handleSubmit">注册</el-button>
      </td>
      <td></td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'page3',
  data () {
    return {
      file: '',
      username: '',
      password: '',
      truePassword: '',
      name: '',
      birthday: '',
      sex: '',
      signature: '',
      loading: false,
      QiniuData: {
        key: '', // 图片名字处理
        token: '' // 七牛云token
      },
      domain: 'https://upload-z1.qiniup.com', // 七牛云的上传地址（华北区）
      qiniuaddr: 'pthxgm509.bkt.clouddn.com', // 七牛云的图片外链地址
      uploadPicUrl: '', // 提交到后台图片地址
      fileList: []
    }
  },
  mounted () {
    this.getQiniuToken()
  },
  methods: {
    isHave () {
      this.$http
        .post(
          'http://47.92.153.85:8080/school_bs/user/findAllUser',
          {
            username: this.username
          },
          { emulateJSON: true }
        )
        .then(result => {
          // this.user=result.body
          if (result.body !== '') {
            this.$layer.msg('该用户已存在！')
            this.username = ''
          } scrollbars
        })
    },
    handleRemove (file, fileList) {
      this.uploadPicUrl = ''
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 3 张图片，如需更换，请删除上一张图片在重新选择！`
      )
    },
    beforeAvatarUpload (file) {
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isPNG && !isJPEG && !isJPG) {
        this.$message.error('上传头像图片只能是 jpg、png、jpeg 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      this.QiniuData.key = `upload_pic_${file.name}`
    },
    uploadSuccess (response, file, fileList) {
      console.log(fileList)
      this.uploadPicUrl = `${this.qiniuaddr}/${response.key}`
    },
    uploadError (err, file, fileList) {
      this.$message({
        message: '上传出错，请重试！',
        type: 'error',
        center: true
      })
    },
    beforeRemove (file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // 提交数据到后台
    handleSubmit () {
      if (
        this.username === '' ||
        this.password === '' ||
        this.truePassword === '' ||
        this.name === ''
      ) {
        this.$layer.msg('请完善信息！')
      } else if (this.password !== this.truePassword) {
        this.$layer.msg('两次密码不一致！')
      } else {
        var dt = new Date(this.birthday)
        var y = dt.getFullYear()
        var m = (dt.getMonth() + 1).toString().padStart(2, '0')
        var d = dt
          .getDate()
          .toString()
          .padStart(2, '0')

        var time = y + '-' + m + '-' + d

        this.$http
          .post(
            'http://47.92.153.85:8080/school_bs/user/addUser',
            {
              username: this.username,
              password: this.password,
              nickname: this.name,
              head: this.uploadPicUrl, // 图片地址
              sex: this.sex,
              birthday: time,
              p_signature: this.signature
            },
            { emulateJSON: true }
          )
          .then(result => {
            if (result.bodyText != '') {
              this.$layer.msg('注册成功')
            } else {
              this.$layer.msg('注册失败')
            }
          })
        this.layer.closeAll()
      }
    },
    // 请求后台拿七牛云token
    getQiniuToken () {
      this.$http
        .get('http://47.92.153.85:8080/school_bs/dynamic/reToken')
        .then(response => {
          this.QiniuData.token = response.bodyText
          console.log(this.QiniuData.token)
        })
        .catch(error => { })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
