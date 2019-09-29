
Shader "VD Vertex Color/Self-Illumin Diffuse" {

	Properties {
	
		_Color ("Main Color", Color) = (1,1,1,1)
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Illum ("Illumin (A)", 2D) = "white" {}
		_EmissionLM ("Emission (Lightmapper)", Float) = 0
	
	}
	
	SubShader {
	
		Tags { "RenderType"="Opaque" }
		LOD 200

		CGPROGRAM
	
		#pragma surface surf Lambert vertex:vert
		sampler2D _MainTex;
		sampler2D _Illum;
		half4 _Color;

		struct Input {
		
			half2 uv_MainTex;
			half2 uv_Illum;
			half4 color;
			
		};

		void vert (inout appdata_full v, out Input o) { 
		
			UNITY_INITIALIZE_OUTPUT(Input,o);
			o.color = v.color;
			
		}
		
		void surf (Input IN, inout SurfaceOutput o) {
		
			half4 t = tex2D(_MainTex, IN.uv_MainTex);
			half4 c = t * _Color;
			o.Albedo = c.rgb * IN.color;
			o.Emission = c.rgb * tex2D(_Illum, IN.uv_Illum).a;
			o.Alpha = c.a;
			
		}
		
		ENDCG
		
	}

	Fallback "Self-Illumin/VertexLit"
	
}
