package com.bleashup.bleashup;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.arthenica.reactnative.RNFFmpegPackage; 
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- Add this line
import org.wonday.orientation.OrientationPackage;
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
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.chirag.RNMail.*;  // <--- import 
//import android.support.v7.app.AppCompatActivity;
import com.imagepicker.ImagePickerPackage;
import com.proyecto26.inappbrowser.RNInAppBrowserPackage;
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
            new SvgPackage(),
            new RNFFmpegPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(),
            new OrientationPackage(),
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
            new RNMail() ,
            new NetInfoPackage(),
            new RNGestureHandlerPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage(),
            new RNInAppBrowserPackage()
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
