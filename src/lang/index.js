import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
// 引入各个语言配置文件
import zh from './zh';
import en from './en';

// var lang = navigator.language || navigator.userLanguage;
// lang = lang.substr(0, 2);//截取lang前2位字符
// localStorage.setItem('locale', lang);

// 创建vue-i18n实例i18n
const i18n = new VueI18n({
    // 设置默认语言
    locale: localStorage.getItem('locale') || 'zh', // 语言标识
    // 添加多语言（每一个语言标示对应一个语言文件）
    messages: {
        zh,
        en,
    },
    silentTranslationWarn: true,
})
// 暴露i18n
export default i18n;
