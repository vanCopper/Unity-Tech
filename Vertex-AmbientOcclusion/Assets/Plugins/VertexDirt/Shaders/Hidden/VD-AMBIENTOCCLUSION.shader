// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'


Shader "Hidden/VD-AMBIENTOCCLUSION" 
{
	SubShader 
	{
        Pass 
		{
			cull front
			fog {mode off}
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"
            
			struct v2f 
			{
                fixed4 pos : SV_POSITION;
				fixed dis : TEXCOORD0;
            };
			
			fixed4 _VDOccluderColor, _VDSkyColor;
			fixed _VDsamplingDistance;
			
            v2f vert (appdata_base v)
			{
                v2f o;
                o.pos = UnityObjectToClipPos (v.vertex);
				o.dis = length(ObjSpaceViewDir(v.vertex));
                return o;
            }
            fixed4 frag (v2f i) : SV_Target
			{
				fixed4 c = fixed4(1,1,1,1);
				half s = smoothstep(_VDsamplingDistance,_VDsamplingDistance+0.001,i.dis);
				c.rgb = lerp (_VDOccluderColor,_VDSkyColor, s);
                return _VDOccluderColor;
			}
            ENDCG
		}
        Pass 
		{
			cull back
			fog {mode off}
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"
            
			struct v2f 
			{
                fixed4 pos : SV_POSITION;
				fixed dis : TEXCOORD0;
            };
			
			fixed4 _VDOccluderColor, _VDSkyColor;
			fixed _VDsamplingDistance;
			
            v2f vert (appdata_base v)
			{
                v2f o;
                o.pos = UnityObjectToClipPos (v.vertex);
				o.dis = length(ObjSpaceViewDir(v.vertex));
                return o;
            }
            fixed4 frag (v2f i) : SV_Target
			{
				fixed4 c = fixed4(1,1,1,1);
				half s = smoothstep(_VDsamplingDistance,_VDsamplingDistance+0.001,i.dis);
				c.rgb = lerp (_VDOccluderColor,_VDSkyColor, s);
                return c;
			}
            ENDCG
		}		
	}
}
