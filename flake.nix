{
  description = "Node.js with Angular CLI development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    common.url = "github:JonasHinterdorfer/flake-templates?dir=common";
  };

  outputs = { self, nixpkgs, common }:
    let
      forAllSystems = common.lib.forAllSystems nixpkgs;
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.buildNpmPackage {
            pname = "myapp";
            version = "0.1.0";
            src = ./.;
            npmDepsHash = ""; # Set to the correct hash after first build
            installPhase = ''
              mkdir -p $out
              npm run build
              cp -r dist/* $out/
            '';
          };
        });

      devShells = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs
              typescript
              typescript-language-server
            ];

            shellHook = ''
              echo "Node.js with Angular development environment loaded"
              echo "Node version: $(node --version)"
              echo "npm version: $(npm --version)"
              echo "Angular CLI version: $(ng version --minimal 2>/dev/null || echo 'Angular CLI installed')"
              
              ${common.lib.interactiveDirenvPrompt}
            '';
          };
        });
    };
}
