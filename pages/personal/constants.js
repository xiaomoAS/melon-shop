import { MEMBER_LEVEL } from '@/constants/common.js'

export const memberConfigs = {
  [MEMBER_LEVEL.NORMAL]: {
    title: '普通会员',
    mainIcon: 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/01f642a1e7d042669128a0d51964c396/user_vip_2.png?Expires=2073952344&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=nlvbrbuVDNPXWBVsfmXLoNDMyeI%3D',
    mainColor: '#42454B',
    mainClass: 'lv_0',
  },
  [MEMBER_LEVEL.GOLD]: {
    title: '黄金会员',
    mainIcon: 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/e51253154f904e96807b119fd66454ea/68d3bf1d3b74463%281%29.png?Expires=2074067880&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=uiO%2Bn17XSer2bNKiTtsoyP%2B2xgo%3D',
    mainColor: '#FF8C00',
    mainClass: 'lv_1',
  },
  [MEMBER_LEVEL.PLATINUM]: {
    title: '铂金会员',
    mainIcon: 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/e41aaf68f7c84c039fba71ea560c54ea/user_vip_1.png?Expires=2073952366&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=KtkIuOIiMTQSK%2FWFn5Eye37WGX4%3D',
    mainColor: '#463BE5',
    mainClass: 'lv_2',
  },
  [MEMBER_LEVEL.DIAMOND]: {
    title: '钻石会员',
    mainIcon: 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/b3d42b5b8e984c7fa814e3e827f33473/user_vip_3.png?Expires=2073952312&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=F19W05Zctzo5cD8E2TCcCauPS2c%3D',
    mainColor: '#0066FF',
    mainClass: 'lv_3',
  },
}