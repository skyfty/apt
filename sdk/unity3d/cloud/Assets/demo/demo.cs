using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using cloud;

public class demo : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        InitParams env = new InitParams();
        env.channel = "google play";
        env.game = "2";
        env.log = true;
        cloud.BI.Instance().init(env);
        cloud.BI.Instance().appOnce("SignIn");
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
