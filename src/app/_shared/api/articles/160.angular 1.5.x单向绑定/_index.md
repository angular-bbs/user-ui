
## 单向绑定

微信名称：冰鉴
作者姓名暂时没想好，文章只是初稿也没弄好，不急哈:)


```
<script>
//问题： 父组件的值改变 子组件的是否改变， 子组件的值改变 --> 父组件的值是否改变
	(function(angular){
		var app = angular.module('app', []);
		app.component('parentComponent', {
			//templateUrl: 'tem.html',
			//require: '^ngModel',
			//transclude: true
			controller: function(){
				var that = this;
				this.$onInit = function(){
					that.person = {
						"name": "Lucy",
						"age": 26
					};
					that.addr = "北京";
				}

				this.$onChanges = function(change){
					console.log('父组件初始化：', change);
				}

				var i =1;
				this.dataChange = function(){
					this.person.name += i;
					this.person.age += i;
					this.addr += i;
					i++;
				}

				//子组件手动更新数据后 同步到父组件
				this.childChange = function(event){
					this.person = event.transPerson;
					this.addr = event.transAddr;
				}

			},
			//绑定变量字符串的不同写法
			template: `<div>
				<div>
					<p>父组件的基本类型: {{$ctrl.addr}}， 引用类型：{{$ctrl.person | json}}</p>
					<button type="button" ng-click="$ctrl.dataChange()">改变父组件的值</button>
				</div>
				<child-component person="$ctrl.person" addr="{{$ctrl.addr}}" up-date="childChange($event)"></child-component>
			</div>`
			//controllerAs: 'parent'
		});

		app.component('childComponent', {
			bindings: {
				person: '<',
				addr: '@',
				onUpdate: '&'
			},
			controller: function(){
				var that = this;
				this.$onInit = function(){
					console.log('绑定字符串', this.addr);
					this.currPerson = angular.copy(this.person);
				}

				//父组件到子组件单向绑定的数据发生变化后 就会调用子组件的$onChange钩子
				this.$onChanges = function(change){
					console.log('子组件初始化：', change);
				}
				var i = 1;
				this.childChange = function(){
					//this.person.name += i;
					//this.person.age += i;
					this.currPerson.name += i;
					this.currPerson.age += i;
					this.addr += i;
					i++;
				}

				//调用父组件传递过来的方法才能更新父组件的数据
				this.update = function(){
					that.onUpdate({
						$event:{
							transPerson: that.currPerson,
							transAddr: that.addr,
						}
					});
				}
			},
			//引用类型的问题，基本类型的改变不会反应到父组件
			template: `<div>
				<button type="button" ng-click="$ctrl.childChange()">改变子组件的值</button>
				<button type="button" ng-click="$ctr,update()">更新子组件值到父组件</button>
				<p>子组件的基本类型: {{$ctrl.addr}}， 引用类型：{{$ctrl.currPerson | json}}</p>
			</div>`
		});
	})(window.angular);
</script>
```