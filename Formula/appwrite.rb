class Appwrite < Formula
  desc "Command-line tool for interacting with the Appwrite API"
  homepage "https://appwrite.io"
  license "BSD-3-Clause"
  version "18.2.0"

  def self.binary_arch
    Hardware::CPU.arm? ? "arm64" : "x64"
  end

  def self.binary_os
    return "darwin" if OS.mac?
    return "linux" if OS.linux?

    raise "Homebrew formula is only supported on macOS and Linux"
  end

  def self.binary_name
    "appwrite-cli-#{binary_os}-#{binary_arch}"
  end

  def self.build_target
    return "mac-#{binary_arch}" if OS.mac?
    return "linux-#{binary_arch}" if OS.linux?

    raise "Homebrew formula is only supported on macOS and Linux"
  end

  # Release automation injects per-target SHA256 values when publishing binaries.
  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/appwrite/sdk-for-cli/releases/download/#{version}/appwrite-cli-darwin-arm64"
      sha256 "b9560f306257169ff74564754078af6183db3d1f83474114625bd8d56ab76b71"
    else
      url "https://github.com/appwrite/sdk-for-cli/releases/download/#{version}/appwrite-cli-darwin-x64"
      sha256 "9a4e0c47adfb49ceea1ea95a2d10fd27d9a905bd0e1d264c6c4a694338732759"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      url "https://github.com/appwrite/sdk-for-cli/releases/download/#{version}/appwrite-cli-linux-arm64"
      sha256 "2c326451973bcb075b8412a39a7e9c7b5bd9384ba9bf3687b0797545601cff81"
    else
      url "https://github.com/appwrite/sdk-for-cli/releases/download/#{version}/appwrite-cli-linux-x64"
      sha256 "2d060808cd91b28f0926c2a6f1c1a5c6aa045c90091ef312f8744eccd8f8c143"
    end
  end

  head "https://github.com/appwrite/sdk-for-cli.git", branch: "master" do
    depends_on "bun" => :build
  end

  def install
    if build.head?
      system "bun", "install", "--frozen-lockfile"
      system "bun", "run", self.class.build_target
      bin.install "build/#{self.class.binary_name}" => "appwrite"
      return
    end

    bin.install self.class.binary_name => "appwrite"
  end

  test do
    assert_match "Usage:", shell_output("#{bin}/appwrite --help")
  end
end
