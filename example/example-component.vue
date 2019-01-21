<template>
	<div class="bot-menu">
		<div v-if="chatpageMenu && chatpageMenu.length <= 1" class="add-item">
			<a @click.prevent="addChatpageItem"
			   href="#">+ Add item</a>
		</div>
		<draggable v-model="chatpageMenu"
				   :options="dragOptions"
				   @end="onDragEnd"
				   class="menu-levels">


			<div v-for="(chatpage, index) in chatpageMenu"
				 :class="{'last-open-collapse':(chatpage.call_to_actions.length && chatpage.call_to_actions[chatpage.call_to_actions.length -1].collapse) ? true  : false}"
				 class="menu-item">
				<div class="menu-item-body">
					<div class="menu-content">
						<span v-if="chatpage.call_to_actions.length"
							  @click="onCollapseChatpage(chatpage)"
							  :class="{'expand':chatpage.collapse}"
							  class="collapse-menu"></span>
						<span @click="showChatpageSetting(chatpage)" class="bot-title">
							<span v-if="chatpage.title && chatpage.title.length > 0" class="title">{{chatpage.title}}</span>
							<span v-if="!chatpage.title.length" class="title text-error">Enter title</span>

							<span v-if="chatpage.type === 'postback' && chatpage.payload.length > 0" class="messages-preview">Messages: ({{chatpage.payload.map(function(payload){return payload.name}).join()}})</span>
							<span v-if="chatpage.type === 'postback' &&! chatpage.payload.length" class="url-preview text-error">Enter block name</span>

							<span v-if="chatpage.type === 'web_url' &&
									chatpage.url"
								  	:class="validateChatpageUrl(chatpage)"
									class="url-preview">URL: {{chatpage.url}}</span>

							<span v-if="chatpage.type === 'web_url' &&
									!chatpage.url"
									class="url-preview text-error">Enter url</span>

						</span>
						<i @click="deleteChatpage(chatpageMenu, index)" class="icon-trash-empty remove-bot-item"></i>
						<span v-if="chatpageMenu.length > 1" class="move-menu-item">
							<i class="icon-down-small"></i>
							<i class="icon-up-small"></i>
						</span>
						<chatpage-item-settings
								:blockMessages="blockMessages"
								:chatpage="chatpage"
								@postbackButtonUpdate="onPostbackButtonUpdate"
								@submenuUpdate="onSubmenuUpdate"
								class="bot-item-settings">
						</chatpage-item-settings>
					</div>
				</div>

				<draggable v-if="chatpage.call_to_actions"
						   v-show="chatpage.collapse"
						   v-model="chatpage.call_to_actions"
						   @end="onDragEnd"
						   :options="dragOptions"
						   class="menu-level-second">

					<div v-for="(catpageSecond, index) in chatpage.call_to_actions" class="menu-item">
						<div class="menu-item-body">
							<div class="menu-content">
								<img src="/admin/images/bot-menu-arrow.png" alt="">
								<span v-if="catpageSecond.call_to_actions.length"
									  @click="onCollapseChatpage(catpageSecond)"
									  :class="{'expand':catpageSecond.collapse}"
									  class="collapse-menu"></span>
								<span @click="showChatpageSetting(catpageSecond)" class="bot-title">
									<span v-if="catpageSecond.title && catpageSecond.title.length > 0" class="title">{{catpageSecond.title}}</span>
									<span v-if="!catpageSecond.title.length" class="title text-error">Enter bot name</span>

									<span v-if="catpageSecond.type === 'postback' && catpageSecond.payload.length > 0" class="messages-preview">Messages: ({{catpageSecond.payload.map(function(payload){return payload.name}).join()}})</span>
									<span v-if="catpageSecond.type === 'postback' &&! catpageSecond.payload.length" class="url-preview text-error">Enter block name</span>

									<span v-if="catpageSecond.type === 'web_url' &&
											catpageSecond.url"
										  :class="validateChatpageUrl(catpageSecond)"
										  class="url-preview">URL: {{catpageSecond.url}}</span>

									<span v-if="catpageSecond.type === 'web_url' &&
											!catpageSecond.url"
										  class="url-preview text-error">Enter url</span>
								</span>
								<i @click="deleteChatpage(chatpage.call_to_actions, index)"
								   class="icon-trash-empty remove-bot-item"></i>
								<span v-if="chatpage.call_to_actions.length > 1" class="move-menu-item">
								<i class="icon-down-small"></i>
								<i class="icon-up-small"></i>
							</span>
								<chatpage-item-settings
										:blockMessages="blockMessages"
										:chatpage="catpageSecond"
										@postbackButtonUpdate="onPostbackButtonUpdate"
										@submenuUpdate="onSubmenuUpdate"
										class="bot-item-settings">
								</chatpage-item-settings>
							</div>
						</div>

						<draggable v-if="catpageSecond.call_to_actions"
								   v-show="catpageSecond.collapse"
								   v-model="catpageSecond.call_to_actions"
								   :options="dragOptions"
								   @end="onDragEnd"
								   class="menu-level-third">

							<div v-for="(catpageThird, index) in catpageSecond.call_to_actions"
								 class="menu-item">
								<div class="menu-item-body">
									<div class="menu-content">
										<img src="/admin/images/bot-menu-arrow.png" alt="">
										<span @click="showChatpageSetting(catpageThird)"
											  class="bot-title">
											<span v-if="catpageThird.title && catpageThird.title.length > 0" class="title">{{catpageThird.title}}</span>
											<span v-if="!catpageThird.title.length" class="title text-error">Enter bot name</span>

											<span v-if="catpageThird.type === 'postback' && catpageThird.payload.length > 0" class="messages-preview">Messages: ({{catpageThird.payload.map(function(payload){return payload.name}).join()}})</span>
											<span v-if="catpageThird.type === 'postback' &&! catpageThird.payload.length" class="url-preview text-error">Enter block name</span>

											<span v-if="catpageThird.type === 'web_url' &&
													catpageThird.url"
												  :class="validateChatpageUrl(catpageThird)"
												  class="url-preview">URL: {{catpageThird.url}}</span>

											<span v-if="catpageThird.type === 'web_url' &&
													!catpageThird.url"
												  class="url-preview text-error">Enter url</span>


										</span>
										<i @click="deleteChatpage(catpageSecond.call_to_actions, index)"
										   class="icon-trash-empty remove-bot-item"></i>
										<span v-if="catpageSecond.call_to_actions.length > 1" class="move-menu-item">
											<i class="icon-down-small"></i>
											<i class="icon-up-small"></i>
										</span>
										<chatpage-item-settings
												:blockMessages="blockMessages"
												:chatpage="catpageThird"
												:subNo="true"
												@postbackButtonUpdate="onPostbackButtonUpdate"
												@submenuUpdate="onSubmenuUpdate"
												class="bot-item-settings">
										</chatpage-item-settings>
									</div>
								</div>
							</div>
						</draggable>

					</div>
				</draggable>
			</div>

		</draggable>
	</div>
</template>
<script>
	import VueDraggable from 'vuedraggable'
	import ChatpageItemSettings from './chatpage-item-settings.vue';

	export default{
		components: {
			'draggable': VueDraggable,
			'chatpage-item-settings': ChatpageItemSettings
		},
		directives: {},
		props: [
			'blockMessages',
			'pageSaveState'
		],
		data () {
			return {
				chatpageMenu: null,

				dragOptions: {
					draggable: '.menu-item',
					forceFallback: true,
					animation: 150,
					scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
					scrollSpeed: 10, // px,
					//group: 'chat_pages',
					handle: '.move-menu-item',
					ghostClass: 'sortable-ghost',  // Class name for the drop placeholder
					chosenClass: 'sortable-chosen',  // Class name for the chosen item
					dragClass: 'sortable-drag'
				},
				resource: {
					chatpageMenu: null,
				}
			}
		},
		watch: {},

		methods: {
			addChatpageItem () {
				if (this.chatpageMenu.length <= 1) {
					this.chatpageMenu.push({
						type: 'postback',
						payload:[],
						call_to_actions: [],
						title: 'Item ' + (this.chatpageMenu.length + 1),
						collapse: false,
						isNew: true,
						showSetting: true,
						url: ''
					})
				}
			},
			deleteChatpage (chatpages, index) {
				chatpages.splice(index, 1);
				this.saveChatpageMenu();
			},
			showChatpageSetting (chatpage) {
				this.chatpageMenu.forEach(function (chatpage) {
					chatpage.showSetting = false;
					if (chatpage.call_to_actions) {
						chatpage.call_to_actions.forEach(function (catpageSecond) {
							catpageSecond.showSetting = false;
							if (catpageSecond.call_to_actions) {
								catpageSecond.call_to_actions.forEach(function (catpageThird) {
									catpageThird.showSetting = false;
								});
							}
						});
					}
				});
				chatpage.showSetting = true;
				this.$forceUpdate();
			},
			getChatpageMenuData (chatpageMenu) {
				let chatpageMenuData = [];
				chatpageMenu.forEach(function (chatpage) {
					let regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);

					if (
						chatpage.type === 'web_url' &&
						chatpage.title.length > 0 &&
						chatpage.url && chatpage.url.match(regex)
					) {
						chatpageMenuData.push({
							title: chatpage.title,
							type: chatpage.type,
							url: chatpage.url
						})
					} else if (
						chatpage.type === 'postback' &&
						chatpage.title.length > 0 &&
						chatpage.payload &&
						chatpage.payload.length > 0
					) {
						let reqChatpage = {
							title: chatpage.title,
							type: chatpage.type,
							payload: []
						};

						chatpage.payload.forEach(function (payload) {
							reqChatpage.payload.push({
								id: payload.id,
								name: payload.name
							});
						});

						chatpageMenuData.push(reqChatpage);
					} else if (
						chatpage.type === 'nested' &&
						chatpage.title &&
						chatpage.call_to_actions.length > 0
					) {
						let reqChatpage = {
							title: chatpage.title,
							type: chatpage.type,
							call_to_actions: this.getChatpageMenuData(chatpage.call_to_actions)
						};

						if(reqChatpage.call_to_actions.length > 0) chatpageMenuData.push(reqChatpage);
					}

				}.bind(this));

				return chatpageMenuData;
			},
			/**
			 * Requests
			 */
			getChatpageMenu () {
				this.resource.chatpageMenu.get({
					pageId: this.$route.params.id
				}).then((response) => {
					if (response && response.bodyText) {
						let data = JSON.parse(response.bodyText).data;
						data.forEach(function (chatpage) {
							chatpage.showSetting = false;
							chatpage.collapse = false;
							if (chatpage.call_to_actions) {
								chatpage.call_to_actions.forEach(function (catpageSecond) {
									catpageSecond.showSetting = false;
									catpageSecond.collapse = false;
									if (catpageSecond.call_to_actions) {
										catpageSecond.call_to_actions.forEach(function (catpageThird) {
											catpageThird.showSetting = false;
										});
									} else {
										catpageSecond.call_to_actions = [];
									}
								});
							} else {
								chatpage.call_to_actions = [];
							}
						});
						this.chatpageMenu = data;
					}

				}, (response) => {

				});
			},
			saveChatpageMenu () {
				let chatpageMenuData = this.getChatpageMenuData(this.chatpageMenu);

				this.resource.chatpageMenu.save({
					pageId: this.$route.params.id
				}, {
					items: chatpageMenuData
				}).then((response) => {

				}, (response) => {

				});

			},
			/**
			 * Events
			 */
			onCollapseChatpage (chatpage) {
				chatpage.collapse = !chatpage.collapse;
			},
			onPostbackButtonUpdate () {
				this.$forceUpdate();
				this.saveChatpageMenu();
			},
			onSubmenuUpdate () {
				this.$forceUpdate();
				this.saveChatpageMenu();
			},
			onDragEnd () {
				this.saveChatpageMenu();
			},
			/**
			 * Validations
			 */
			validateChatpageUrl (chatpage) {
				let regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
				let res = [];

				if (chatpage.url === undefined || !chatpage.url.match(regex)) res.push('text-error');

				return res;
			},
			/**
			 * Popups
			 */
			manageRoleModal () {
				this.$refs.manageRoleModal.show();
			},

			/**
			 * Initialises
			 */
			initResources () {
				this.resource.chatpageMenu = this.$resource('chat_pages/{pageId}/persistent_menus');
			}
		},
		created () {
			this.initResources();
			this.getChatpageMenu();
		}
	}
</script>