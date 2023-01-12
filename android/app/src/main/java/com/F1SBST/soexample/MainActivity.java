package com.F1SBST.soexample;


import android.content.Context;
import android.content.Intent;

import android.os.Bundle;

import android.util.Log;

import com.F1SBST.soexample.invokenative.PushModule;
import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;
import com.umeng.analytics.MobclickAgent.EScenarioType;
import com.umeng.message.PushAgent;

import org.devio.rn.splashscreen.SplashScreen;



import pro.piwik.sdk.Tracker;
import pro.piwik.sdk.extra.TrackHelper;

//import com.umeng.socialize.UMShareAPI;

public class MainActivity extends ReactActivity {


    protected void onCreate(Bundle savedInstanceState) {


        super.onCreate(savedInstanceState);

        SplashScreen.show(this);
        // ShareModule.initSocialSDK(this);
        PushModule.initPushSDK(this);
        MobclickAgent.setSessionContinueMillis(1000);
        MobclickAgent.setScenarioType(this, EScenarioType.E_DUM_NORMAL);
        MobclickAgent.openActivityDurationTrack(false);
        PushAgent.getInstance(this).onAppStart();PushAgent.getInstance(this).onAppStart();



    }



    @Override
    public void onResume() {
        super.onResume();
//        android.util.Log.e("xxxxxx","onResume=");
        MobclickAgent.onResume(this);
    }
    @Override
    protected void onPause() {
        super.onPause();
//        android.util.Log.e("xxxxxx","onPause=");

        MobclickAgent.onPause(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        //MobclickAgent.onKillProcess(this);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

    @Override
    protected String getMainComponentName() {
        return "UMComponent";
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        // UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
    }







}
