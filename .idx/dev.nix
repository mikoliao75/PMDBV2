{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; 

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
    pkgs.zip
  ];

  # Sets environment variables in the workspace
  env = {
    NEXT_PUBLIC_FIREBASE_API_KEY = "AIzaSyCt0yH4CxjNGSAwZo9EGyRicrQWN2V4_TI";
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "pm-dashboard-personal-20-ea9df.firebaseapp.com";
    NEXT_PUBLIC_FIREBASE_PROJECT_ID = "pm-dashboard-personal-20-ea9df";
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "pm-dashboard-personal-20-ea9df.firebasestorage.app";
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "343902118337";
    NEXT_PUBLIC_FIREBASE_APP_ID = "1:343902118337:web:6bb14830304264ceaf0f40";
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = "G-88SFDHQDJT";
    GOOGLE_API_KEY = "AIzaSyAE_LDtrncWwi7o9OtkZEaHAagRbw4S1GE"; # Corrected from GEMINI_API_KEY
  };

  services.firebase.emulators = {
    detect = false;
    projectId = "pm-dashboard-personal-20-ea9df";
    services = [ "auth" "firestore" "storage" ]; 
  };

  idx = {
    extensions = [];

    workspace = {
      onCreate = {
        default.openFiles = [
          "src/app/page.tsx"
        ];
      };
      onStart = {
        install = "npm install";
      };
    };

    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}