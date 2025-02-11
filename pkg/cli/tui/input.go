// everest
// Copyright (C) 2025 Percona LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Package tui provides UI elements for the CLI.
package tui

import (
	"context"
	"fmt"
	"strings"

	"github.com/charmbracelet/bubbles/help"
	"github.com/charmbracelet/bubbles/key"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
)

type (
	// inputKeyMap defines a set of keybindings. To work for help it must satisfy
	// key.Map. It could also very easily be a map[string]key.Binding.
	inputKeyMap struct {
		Confirm key.Binding
		Quit    key.Binding
	}

	// Input represents a text input element.
	Input struct {
		keys         inputKeyMap
		help         help.Model
		textInput    textinput.Model
		p            *tea.Program
		done         bool              // user has confirmed the input
		interrupt    bool              // set in case user wants to quit (Esc or Ctrl+c)
		validateFunc ValidateInputFunc // function to validate the input
		hint         string            // hint to show in the input field
		defaultValue string            // default value to show in the input field
	}

	// InputOption is used to set options when initializing Input.
	// Input can accept a variable number of options.
	//
	// Example usage:
	//
	//	p := NewInput(ctx, WithValidation(validationFunc), WithHint(hintMessage))
	InputOption func(m *Input)
)

// Key bindings.
var inputKeys = inputKeyMap{
	Confirm: confirmKeyBinding,
	Quit:    quitKeyBinding,
}

// ShortHelp returns keybindings to be shown in the mini help view. It's part
// of the key.Map interface.
func (k inputKeyMap) ShortHelp() []key.Binding {
	return []key.Binding{k.Confirm, k.Quit}
}

// FullHelp returns keybindings for the expanded help view. It's part of the
// key.Map interface.
func (k inputKeyMap) FullHelp() [][]key.Binding {
	return [][]key.Binding{
		{k.Confirm, k.Quit}, // first column
		{},                  // second column
	}
}

// NewInput creates a new text input element.
func NewInput(ctx context.Context, message string, opts ...InputOption) Input {
	ti := textinput.New()
	ti.Prompt = fmt.Sprintf("❓ %s: ", message)
	ti.PromptStyle = textStyle
	ti.Cursor.Style = textStyle
	ti.Cursor.TextStyle = textStyle
	ti.Focus()

	m := Input{
		keys:      inputKeys,
		help:      newHelpModel(),
		textInput: ti,
	}

	// Apply all options to the program.
	for _, opt := range opts {
		opt(&m)
	}

	p := tea.NewProgram(m, tea.WithContext(ctx))
	m.p = p
	return m
}

// WithInputDefaultValue lets you specify a default value that will be shown in the dialog
// when the user is prompted for input.
func WithInputDefaultValue(defaultValue string) InputOption {
	return func(m *Input) {
		if defaultValue != "" {
			m.defaultValue = defaultValue
			m.textInput.Placeholder = defaultValue
			m.textInput.PlaceholderStyle = helperTextStyle
		}
	}
}

// WithInputHint lets you specify a hint message that will be shown in the dialog
// when the user is prompted for input.
func WithInputHint(hint string) InputOption {
	return func(m *Input) {
		if hint != "" {
			m.hint = fmt.Sprintf("HINT: %s", hint)
		}
	}
}

// WithInputValidation lets you specify a validate function that will be
// used to validate user's input.
func WithInputValidation(validateFunc ValidateInputFunc) InputOption {
	return func(m *Input) {
		if validateFunc != nil {
			m.validateFunc = validateFunc
		}
	}
}

// Run runs the text input element.
func (m Input) Run() (string, error) {
	model, err := m.p.Run()
	if err != nil {
		return "", err
	}

	if model.(Input).interrupt {
		return "", ErrUserInterrupted
	}

	if model.(Input).validateFunc != nil {
		if err := model.(Input).validateFunc(model.(Input).textInput.Value()); err != nil {
			return "", err
		}
	}
	return model.(Input).textInput.Value(), nil
}

// Init initializes the text input element.
// Implements bubbletea.Model interface.
func (m Input) Init() tea.Cmd {
	return textinput.Blink
}

// Update updates the text input element.
// Implements bubbletea.Model interface.
func (m Input) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd

	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch {
		case key.Matches(msg, m.keys.Confirm):
			m.done = true
			m.textInput.Blur()
			if m.textInput.Value() == "" {
				m.textInput.SetValue(m.defaultValue)
			}
			cmd = tea.Quit
		case key.Matches(msg, m.keys.Quit):
			m.done = true
			m.interrupt = true
			m.textInput.Blur()
			cmd = tea.Quit
		}
	}

	var textInputCmd tea.Cmd
	m.textInput, textInputCmd = m.textInput.Update(msg)

	return m, tea.Sequence(textInputCmd, cmd)
}

// View renders the input element view.
// Implements bubbletea.Model interface.
func (m Input) View() string {
	s := strings.Builder{}
	s.WriteString(fmt.Sprintf("%s\n", m.textInput.View()))

	if !m.done {
		if m.hint != "" {
			s.WriteString(fmt.Sprintf("\n%s\n", helperTextStyle.Render(m.hint)))
		}
		s.WriteString(fmt.Sprintf("\n%s\n", m.help.View(m.keys)))
	}

	return s.String()
}
