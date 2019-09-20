package com.bleashup.bleashup;

import android.app.Application;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactApplication;
import com.zmxv.RNSound.RNSoundPackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.reactnativecommunity.rctaudiotoolkit.AudioPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.peel.react.TcpSocketsModule;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.rnfs.RNFSPackage; // <--- import 
import com.facebook.react.ReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.github.mr03web.softinputmode.SoftInputModePackage;
import com.chirag.RNMail.*;  // <--- import 
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage; // <--- Import Package
//import android.support.v7.app.AppCompatActivity;
import com.swmansion.reanimated.ReanimatedPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSoundPackage(),
            new ReactSliderPackage(),
            new AudioPackage(),
          new SvgPackage(),
            new AsyncStoragePackage(),
            new VectorIconsPackage(),
            new RNExitAppPackage(),
            new ReanimatedPackage(),
            new TcpSocketsModule(),
            new RNFSPackage(),
            new RNMail() ,
             new NetInfoPackage(),
             new SoftInputModePackage() ,
            new RNGestureHandlerPackage(),
            new RNFetchBlobPackage(),
            new ReactNativePushNotificationPackage() // <---- Add the Package
                  );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

  }
}
