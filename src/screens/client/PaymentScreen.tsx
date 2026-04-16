import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import { sendSessionRequestNotification } from '@/utils/notifications';
import styles from '@/styles/screens/client/PaymentScreen.styles';

type RouteParams = {
  Payment: {
    psychiatrist: {
      id: string;
      user_id: string;
      full_name: string;
      specialization: string;
      price: number;
    };
  };
};

type PaymentMethod = 'upi' | 'card';

export default function PaymentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'Payment'>>();
  const { user } = useAuth();
  const { psychiatrist } = route.params;

  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    setPaying(true);

    // Simulate payment processing (1.5s delay)
    await new Promise(res => setTimeout(res, 1500));
    setSuccess(true);

    // After showing success for 1.5s, create session and navigate
    await new Promise(res => setTimeout(res, 1500));

    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          client_id: user?.id,
          psychiatrist_id: psychiatrist.id,
          type: 'video',
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      const clientName = user?.isAnonymous
        ? (user.alias ?? 'Anonymous')
        : (user?.displayName || user?.email?.split('@')[0] || 'A client');

      sendSessionRequestNotification(psychiatrist.user_id, clientName, 'video', data.id);

      navigation.replace('SessionWaiting', {
        sessionId: data.id,
        psychiatrist,
      });
    } catch {
      navigation.replace('ClientTabs');
    } finally {
      setPaying(false);
    }
  };

  const isPayReady = method === 'upi' ? upiId.includes('@') : (cardNumber.length >= 16 && expiry.length === 5 && cvv.length === 3);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>SESSION SUMMARY</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryAvatar}>
              <Text style={styles.summaryAvatarText}>
                {psychiatrist.full_name?.[0]?.toUpperCase() ?? 'D'}
              </Text>
            </View>
            <View>
              <Text style={styles.summaryName}>Dr. {psychiatrist.full_name}</Text>
              <Text style={styles.summarySpec}>{psychiatrist.specialization}</Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryFeeRow}>
            <Text style={styles.summaryFeeLabel}>Video Call Session</Text>
            <View>
              <Text style={styles.summaryFeeValue}>₹{psychiatrist.price ?? 199}</Text>
              <Text style={styles.summaryDuration}>30 minutes</Text>
            </View>
          </View>
        </View>

        {/* Payment method */}
        <Text style={styles.sectionLabel}>Payment Method</Text>
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[styles.methodBtn, method === 'upi' && styles.methodBtnActive]}
            onPress={() => setMethod('upi')}
          >
            <Ionicons name="phone-portrait-outline" size={22} color={method === 'upi' ? '#6C63FF' : '#999'} />
            <Text style={[styles.methodText, method === 'upi' && styles.methodTextActive]}>UPI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodBtn, method === 'card' && styles.methodBtnActive]}
            onPress={() => setMethod('card')}
          >
            <Ionicons name="card-outline" size={22} color={method === 'card' ? '#6C63FF' : '#999'} />
            <Text style={[styles.methodText, method === 'card' && styles.methodTextActive]}>Card</Text>
          </TouchableOpacity>
        </View>

        {/* UPI fields */}
        {method === 'upi' && (
          <>
            <Text style={styles.inputLabel}>UPI ID</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="at" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="yourname@upi"
                placeholderTextColor="#999"
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </>
        )}

        {/* Card fields */}
        {method === 'card' && (
          <>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#999"
                value={cardNumber}
                onChangeText={t => setCardNumber(t.replace(/\D/g, '').slice(0, 16))}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.cardRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#999"
                  value={expiry}
                  onChangeText={t => {
                    const clean = t.replace(/\D/g, '').slice(0, 4);
                    setExpiry(clean.length > 2 ? `${clean.slice(0,2)}/${clean.slice(2)}` : clean);
                  }}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="CVV"
                  placeholderTextColor="#999"
                  value={cvv}
                  onChangeText={t => setCvv(t.replace(/\D/g, '').slice(0, 3))}
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>
          </>
        )}

        {/* Secure note */}
        <View style={styles.secureNote}>
          <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
          <Text style={styles.secureText}>Your payment is 256-bit encrypted and secure</Text>
        </View>

        {/* Pay button */}
        <TouchableOpacity
          style={[styles.payBtn, (!isPayReady || paying) && { opacity: 0.6 }]}
          onPress={handlePay}
          disabled={!isPayReady || paying}
        >
          {paying && !success
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="lock-closed" size={18} color="#fff" />
                <Text style={styles.payBtnText}>Pay ₹{psychiatrist.price ?? 199}</Text>
              </>
          }
        </TouchableOpacity>
      </ScrollView>

      {/* Success overlay */}
      {success && (
        <View style={styles.successOverlay}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark-circle" size={54} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSub}>Connecting you with Dr. {psychiatrist.full_name}...</Text>
          <ActivityIndicator color="#6C63FF" style={{ marginTop: 8 }} />
        </View>
      )}
    </SafeAreaView>
  );
}
