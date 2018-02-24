<template>
	<!--    照片添加  参考https://www.jianshu.com/p/0cf14f4bc2eb 基于钉钉移动端api的图片上传 -->
	<section class="aui-grid aui-margin-t-15">
		<div class="aui-row">
			<div class="aui-col-xs-4 img-box" v-for=" (imgsrc,index) in imgcontent">
				<i class="aui-iconfont aui-note" @click="dete(index)"></i>
				<img :src="imgsrc" @click="tuplock(index)">
			</div>
			<div class="aui-col-xs-4 img-box img-picread" v-if="picnum">
				<div class="icon-img">
					<img src="../../assets/logo.png">
				</div>
				<div class="aui-grid-label" ref="divGenres">
					<input type="file" name="file" id="file" value="" accept="image/*" multiple @change="imgChange(this.value);" />
				</div>
			</div>
		</div>
	</section>
</template>
<script>
import picurl from '@/assets/picurl'
	// var client = new OSS.Wrapper({
	// 	region: '',
	// 	accessKeyId: '',
	// 	accessKeySecret: '',
	// 	bucket: ''
	// });
	export default {
		data(){
			return {
				imgcontent: [],
				picnum: true,
				reast: "",
				pictic:picurl,
				urltype: [],
				bpic: [],
				anzhuoid: "",
			}
		},
		methods:{
			dete: function(index) {
				console.log(index);
				let that = this;
				dd.device.notification.confirm({
					message: "你确定要删除这张图片吗",
					title: "提示",
					buttonLabels: ['确定', '取消'],
					onSuccess: function(result) {
						if(result.buttonIndex == "0") {
							that.imgcontent.splice(index, 1);
							that.urltype.splice(index, 1);
							that.bpic.splice(index, 1);
							dd.device.notification.toast({
								icon: '', //icon样式，有success和error，默认为空 0.0.2
								text: '删除成功!', //提示信息
								duration: 1, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
								delay: 0, //延迟显示，单位秒，默认0
								onSuccess: function(result) {
									that.picnum = true;
									return
								}
							});
							return
						}
					},
					onFail: function(err) {}
				});
			},
			tuplock: function(index) {
				const _this = this
				console.log(_this.bpic)
				dd.biz.util.previewImage({
					urls: _this.bpic, //图片地址列表
					current: _this.bpic[index], //当前显示的图片链接
					onSuccess: function(result) {
						/**/
					},
					onFail: function(err) {}
				})
			},
			imgChange(e) {
				//console.log(this.urltype);
				var f = document.getElementById("file").files[0];

				var val = document.getElementById("file").value;
				//let f = this.$refs.divGenres.querySelectorAll('#file')[0].files[0];
				let typepic = this.$refs.divGenres.querySelectorAll('#file')[0].files[0].type;
				console.log(typepic);

				var u = navigator.userAgent;
				if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
					let lit = typepic.replace("image/", "");
					if(lit != "JPEG" && lit != "jpeg" && lit != "PNG" && lit != "png" && lit != "jpg" && lit != "JPG" && lit != "gif" && lit != "GIF") {
						//							alert("上传图片类型错误");  

						dd.device.notification.toast({text: '图片格式有误!',duration: 1});
						return false;
					}
				}
				if(f == undefined) {
					return;
				}

				if(this.imgcontent.length >= 8) {
					this.picnum = false;
					dd.device.notification.toast({text: '最多只能上传9张图片!',duration: 1});

				}

				//获取点击的文本框
				var file = document.getElementById("file");
				//获取的图片文件
				var fileList = file.files;
				var imgArr = [];
				//遍历获取到得图片文件
				// this.load = true
				if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && fileList.length>1) {
					if (fileList.length>1) {
							// this.load = false;
							dd.device.notification.toast({text: '暂不支持多张图片上传,请重新选择!',duration: 1});
						return false
					} else {
						for(let i = 0; i < fileList.length; i++) {
							// this.load = true;
							var imgUrl = window.URL.createObjectURL(file.files[i]);
							imgArr.push(imgUrl);
							this.imgcontent.push(imgUrl);

							var suffix = val.substr(val.indexOf("."));
							// 这里是生成文件名
							// alert(f.type);
							var obj = this.reast + i; // 这里是生成文件名
							var storeAs = picurl+"/" + obj + suffix; //命名空间
							//console.log(' => ' + storeAs);
							var self = this;
							console.log(fileList[i])
								//console.log(f)
							client.multipartUpload(storeAs, fileList[i]).then(function(result) {
								console.log(result); //返回对象
								let resultre = result.name.replace(picurl+'/', '');
								let typeimg = result.name.slice(-3);
								(typeimg == "jpg") ? typeimg = "0": typeimg = "1";
								let urlupdat = '{"fileId":"' + resultre + '","fileType":' + typeimg + '}';
								self.urltype.push(urlupdat);
								// 点击预览图片准备
								let bigdat = 'http://sysvoc-pic.speiyou.cn/'+picurl+'/' + resultre + '?x-oss-process=image/resize,m_lfit,h_950,w_950';
								self.bpic.push(bigdat);
								// self.load = false;
							}).catch(function(err) {
								console.log(err);
							});
							if (i==8) {
								this.picnum = false;
							} 
						};
					}
				} else if(/(Android)/i.test(navigator.userAgent)) {
					for(var i = 0; i < fileList.length; i++) {
						var imgUrl = window.URL.createObjectURL(file.files[i]);
						imgArr.push(imgUrl);
						// alert(i)
						this.imgcontent.push(imgUrl);

						var suffix = val.substr(val.indexOf("."));
						// 这里是生成文件名
						// alert(f.type);
						var obj = this.anzhuoid++; // 这里是生成文件名
						var storeAs = picurl+"/" + obj + suffix; //命名空间
						console.log(' => ' + storeAs);
						var self = this;
						client.multipartUpload(storeAs, f).then(function(result) {
							console.log(result); //返回对象
							//alert(result.name);
							let resultre = result.name.replace(picurl+'/', '');
							let typeimg = result.name.slice(-3);
							(typeimg == "jpg") ? typeimg = "0": typeimg = "1";
							let urlupdat = '{"fileId":"' + resultre + '","fileType":' + typeimg + '}';
							let bigdat = 'http://sysvoc-pic.speiyou.cn/'+picurl+'/' + resultre + '?x-oss-process=image/resize,m_lfit,h_950,w_950'
							self.urltype.push(urlupdat)
							self.bpic.push(bigdat)
							// self.load = false
								//console.log(result.url); //返回链接
						}).catch(function(err) {
							console.log(err);
						});
					};
				} else {
					//ios单图拍照上传
					for(var i = 0; i < fileList.length; i++) {
						var imgUrl = window.URL.createObjectURL(file.files[i]);
						imgArr.push(imgUrl);
						// alert(i)
						this.imgcontent.push(imgUrl);

						var suffix = val.substr(val.indexOf("."));
						// 这里是生成文件名
						// alert(f.type);
						var obj = this.anzhuoid++; // 这里是生成文件名
						var storeAs = picurl+"/" + obj + suffix; //命名空间
						console.log(' => ' + storeAs);
						var self = this;
						client.multipartUpload(storeAs, f).then(function(result) {
							console.log(result); //返回对象
							let resultre = result.name.replace(picurl+'/', '');
							let typeimg = result.name.slice(-3);
							(typeimg == "jpg") ? typeimg = "0": typeimg = "1";
							let urlupdat = '{"fileId":"' + resultre + '","fileType":' + typeimg + '}';
							let bigdat = 'http://sysvoc-pic.speiyou.cn/'+picurl+'/' + resultre + '?x-oss-process=image/resize,m_lfit,h_950,w_950'
							self.urltype.push(urlupdat)
							self.bpic.push(bigdat)
							// self.load = false;
								//console.log(result.url); //返回链接
						}).catch(function(err) {
							console.log(err);
						});
					};


				};
				console.log(imgArr)
			},


		}
	}
</script>
<style>
	.container {
		width: 100%;
		height: 100%;
		overflow: auto;
		clear: both;
	}

	.aui-col-xs-4 {
		height: 5.5rem;
	}
	#file {
	height: 100%;
	width: 100%;
	top: 0;
	}

	.aui-note {
		display: inline-block;
		background-image: url("data:image/png;base64,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");
		background-size: 1rem;
		background-position: bottom;
		background-repeat: no-repeat;
	}
	.aui-iconfont {
		position: absolute;
		z-index: 999;
		top: 0rem;
		right: 0px;
		display: inline-block;
		height: 1rem;
		width: 1rem;
		font-size: 0.7rem;
		line-height: 1rem;
	}
	
	.aui-grid-label input[type="file"] {
		opacity: 0;
	}
	
	.aui-grid [class*=aui-col-] {
		display: table-cell;
		position: relative;
		text-align: center;
		vertical-align: middle;
		padding: 0.2rem;
		height: 5.5rem;
	}
	.aui-grid{
		padding: 0 0.75rem;
	}
	.img-box img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
	
	#footer .aui-bar-tab-item .iconfont {
		font-size: 0.75rem;
	}
	
	.img-box {
		height: 5.5rem;
		border: 1px solid #E7E7E7;
		box-sizing: border-box;
		overflow: hidden;
	}
	
	.icon-img {
		position: absolute;
		font-size: 2.4rem;
		/* line-height: 2.4rem; */
		/* height: auto; */
		z-index: 0;
		width: 100%;
		height: 5.5rem;
		left: 0;
		top: 0;
		/* background: #0c9; */
	}
	
	.img-picread .icon-img img {
		width: 2.2rem;
		height: 2.2rem;
		margin: 1.65rem 0;
		display: inline-block;
	}
	.aui-grid .aui-grid-label {
		display: block;
		font-size: 0.7rem;
		position: relative;
		margin-top: 0.25rem;
		overflow: hidden;
		height: 5.5rem;
	}
</style>