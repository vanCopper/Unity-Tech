
Shader "VD Vertex Color/Bumped Diffuse" {

	Properties {
	
		_Color ("Main Color", Color) = (1,1,1,1)
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_BumpMap ("Normalmap", 2D) = "bump" {}
	
	}
	
	SubShader {
	
		Tags { "RenderType"="Opaque" }
		LOD 300

		CGPROGRAM
	
		#pragma surface surf Lambert vertex:vert
		sampler2D _MainTex;
		sampler2D _BumpMap;
		half4 _Color;

		struct Input {
		
			half2 uv_MainTex;
			half4 color;
			half2 uv_BumpMap;
			
		};

		void vert (inout appdata_full v, out Input o) { 
		
			UNITY_INITIALIZE_OUTPUT(Input,o);
			o.color = v.color * _Color; 
			
		}
		
		void surf (Input IN, inout SurfaceOutput o) {
		
			half4 t = tex2D(_MainTex, IN.uv_MainTex);
			o.Albedo = t.rgb * IN.color.rgb;
			o.Normal = UnpackNormal(tex2D(_BumpMap, IN.uv_BumpMap));
			o.Alpha = t.a;
			
		}
		
		ENDCG
		
	}

	Fallback "VD Vertex Color/Diffuse"
	
}

