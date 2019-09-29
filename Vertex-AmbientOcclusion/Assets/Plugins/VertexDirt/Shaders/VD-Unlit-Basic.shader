
Shader "VD Vertex Color/Unlit Basic" {

	Properties {
		_Color ("Main Color", Color) = (1,1,1,1)
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_VCIntensity ("Vertex color intensity", float) = 1.0
	}
	
	SubShader {
		
		LOD 50
		Tags { "RenderType"="Opaque" }
				
		CGPROGRAM
		#pragma surface surf VCUnlit vertex:vert approxview noambient novertexlights nolightmap noforwardadd nodirlightmap 

		inline fixed4 LightingVCUnlit (SurfaceOutput s, fixed3 lightDir, fixed atten) {
			return fixed4(s.Albedo, s.Alpha);
		}	
		
		struct Input {
			half2 uv_MainTex;
			half4 color;
		};
      
	  	sampler2D _MainTex;
		half4 _Color;
		half _VCIntensity;

		void vert (inout appdata_full v, out Input o) { 
			UNITY_INITIALIZE_OUTPUT(Input,o);
			o.color = lerp(half4(1,1,1,1),v.color,_VCIntensity) * _Color;
		}
		
		void surf (Input IN, inout SurfaceOutput o) {
			half4 c = tex2D (_MainTex, IN.uv_MainTex);
			o.Albedo = c.rgb * IN.color.rgb;
			o.Alpha = c.a;
		}
		
		ENDCG
		
	}
	
}
