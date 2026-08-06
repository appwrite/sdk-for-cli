package app

import (
	"fmt"
	"os"
	"path/filepath"

	sdkfile "github.com/appwrite/sdk-for-go/v6/file"
)

// InputFile turns a path into the SDK's upload type.
//
// The path is checked here rather than at upload time so a typo fails before
// any request is made.
func InputFile(path string) (sdkfile.InputFile, error) {
	if path == "" {
		return sdkfile.InputFile{}, fmt.Errorf("a file path is required")
	}

	resolved, err := filepath.Abs(path)
	if err != nil {
		return sdkfile.InputFile{}, err
	}
	if _, err := os.Stat(resolved); err != nil {
		return sdkfile.InputFile{}, fmt.Errorf("cannot read %q: %w", path, err)
	}

	return sdkfile.NewInputFile(resolved, filepath.Base(resolved)), nil
}
