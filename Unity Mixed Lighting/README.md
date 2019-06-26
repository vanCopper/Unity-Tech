# Unity Mixed Lighting

Unity中有三种灯光模式：Realtime Lighting，Mixed Lighting，Bake Lighting。

![](./images/Mix_00.png)

**Realtime : ** 实时光照

**Mixed : ** 实时光照与烘焙混合使用

**Baked : ** 仅有烘焙灯光

其中Mixed Lighting较为复杂，因为处理实时灯光的同时还需要考虑烘焙出来的Lightmap的使用，Shader也更为复杂。Mixed Lighting又有三种模式：Bake Indirect, Subtractive, ShadowMask。



### Ref

>https://catlikecoding.com/unity/tutorials/rendering/part-17/
>
>http://ma-yidong.com/2017/09/02/mixed-lighting-lightmap-shader-in-unity/
>
>https://zhuanlan.zhihu.com/p/34477578

