package com.bleashup.bleashup;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import org.reactnative.camera.RNCameraPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.arthenica.reactnative.RNFFmpegPackage; 
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- Add this line
import com.calendarevents.CalendarEventsPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // <-- Add this line
import com.kevinresol.react_native_sound_recorder.RNSoundRecorderPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.peel.react.TcpSocketsModule;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
//import android.support.v7.app.AppCompatActivity;
import com.proyecto26.inappbrowser.RNInAppBrowserPackage;
import java.util.Arrays;
import java.util.List;
import com.rt2zz.reactnativecontacts.ReactNativeContacts; 

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
            new NetInfoPackage(),
            new RNScreensPackage(),
            new FastImageViewPackage(),
            new RNPermissionsPackage(),
            new RNCameraPackage(),
            new SvgPackage(),
            new RNFFmpegPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseDatabasePackage(),
            new RNFirebaseNotificationsPackage(),
            new RNSoundRecorderPackage(),
            new DocumentPickerPackage(),
            new PickerPackage(),
            new CalendarEventsPackage(),
            new RNFileViewerPackage(),
            new RNDateTimePickerPackage(),
            new ReactVideoPackage(),
            new RNSoundPackage(),
            new RNFirebaseMessagingPackage(),
            new AsyncStoragePackage(),
            new VectorIconsPackage(),
            new TcpSocketsModule(),
            new RNGestureHandlerPackage(),
            new RNFetchBlobPackage(),
            new RNInAppBrowserPackage(),
            new ReactNativeContacts()
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

  /*
  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage  false);
    //MultiDex.install(getBaseContext()); //opotional, for some case this might cause an error
    AdobeCSDKFoundation.initializeCSDKFoundation(getApplicationContext());
  }

  @Override
  public String getClientID() {
      return "46dea44f58734ea2a9d97861cc431a43";
  }

  @Override
  public String getClientSecret() {
      return "27b441c1-6d83-4898-9fc9-b0bf7d6f6ed5";
  }

  @Override
  public String getRedirectURI() {
      return "ams\\+c524e8835130d05139d2656459b1880883ebbd9a://adobeid/46dea44f58734ea2a9d97861cc431a43";
  }

  
  @Override
  public String[] getAdditionalScopesList() {
      return new String[]{"ndeffo.jugal98@gmail.com", "profile", "address"};
  }*/

}
