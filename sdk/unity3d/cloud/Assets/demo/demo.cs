using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cloud;

public class demo : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        InitParams env = new InitParams();
        env.channel = "google play";
        env.game = "2";
        env.log = true;
        Cloud.BI.Instance().init(env);
        Cloud.BI.Instance().appOnce("SignIn");
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
