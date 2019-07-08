// **********************************************************************
// Author: vanCopper
// Date: 2019/7/5 18:35:02
// Desc: 
// **********************************************************************
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[ExecuteInEditMode]
public class ShadowMaskTmp : MonoBehaviour
{
    public Texture2D ShadowMask;

    [ContextMenu("Apply ShadowMask")]
    void Apply()
    {
        Shader.SetGlobalTexture("_ShadowMask", ShadowMask);
    }

    void Start()
    {

    }


    void Update()
    {
        Shader.SetGlobalTexture("_ShadowMask", ShadowMask);
    }
}
