package com.bleashup;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import android.media.MediaPlayer;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;


public class SoundPlayer extends ReactContextBaseJavaModule {


    public SoundPlayer(ReactApplicationContext reactContext){
        super(reactContext);
    }
    public String getName(){
        return "SoundPlayer";
    }

}
