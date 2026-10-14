import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import clsx from "clsx";
import dayjs from "dayjs";
import { resolveSubscriptionIcon } from "../lib/subscriptionIcons";
import { colors } from "../constants/theme";

const FREQUENCIES = ["Monthly", "Yearly"] as const;

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

type Frequency = (typeof FREQUENCIES)[number];
type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: "#f7c6c7",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#c9e4ca",
  Cloud: "#cfe3f7",
  Music: "#b8e8d0",
  Other: "#f6eecf",
};

// Accepts both "9.99" and "9,99" since decimal-pad shows a comma on pt-BR devices.
const parsePrice = (value: string) => Number(value.trim().replace(",", "."));

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState<Category>("Other");

  const parsedPrice = parsePrice(price);
  const isNameValid = name.trim().length > 0;
  const isPriceValid = Number.isFinite(parsedPrice) && parsedPrice > 0;
  const showPriceError = price.trim().length > 0 && !isPriceValid;
  const canSubmit = isNameValid && isPriceValid;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const trimmedName = name.trim();
    const startDate = dayjs();
    const renewalDate = startDate.add(1, frequency === "Monthly" ? "month" : "year");

    onCreate({
      id: `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: trimmedName,
      price: Math.round(parsedPrice * 100) / 100,
      currency: "USD",
      frequency,
      billing: frequency,
      category,
      status: "active",
      startDate: startDate.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: resolveSubscriptionIcon(trimmedName),
      color: CATEGORY_COLORS[category],
    });

    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="modal-overlay">
          <Pressable
            className="absolute inset-0"
            onPress={handleClose}
            accessibilityLabel="Close new subscription"
          />

          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>

              <Pressable
                className="modal-close"
                onPress={handleClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerClassName="modal-body"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Netflix"
                  placeholderTextColor={colors.mutedForeground}
                  className="auth-input"
                  autoCapitalize="words"
                  returnKeyType="next"
                  accessibilityLabel="Name"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor={colors.mutedForeground}
                  className={clsx("auth-input", showPriceError && "auth-input-error")}
                  keyboardType="decimal-pad"
                  accessibilityLabel="Price"
                  aria-invalid={showPriceError}
                />
                {showPriceError && (
                  <Text className="auth-error">Enter a price greater than zero.</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {FREQUENCIES.map((option) => {
                    const active = frequency === option;
                    return (
                      <Pressable
                        key={option}
                        onPress={() => setFrequency(option)}
                        className={clsx("picker-option", active && "picker-option-active")}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: active }}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            active && "picker-option-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((option) => {
                    const active = category === option;
                    return (
                      <Pressable
                        key={option}
                        onPress={() => setCategory(option)}
                        className={clsx("category-chip", active && "category-chip-active")}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: active }}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            active && "category-chip-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Pressable
                className={clsx("auth-button", !canSubmit && "auth-button-disabled")}
                onPress={handleSubmit}
                disabled={!canSubmit}
                accessibilityRole="button"
                accessibilityState={{ disabled: !canSubmit }}
              >
                <Text className="auth-button-text">Add Subscription</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
