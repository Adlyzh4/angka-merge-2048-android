// app/how-to-play.tsx
import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useHighScore } from '../src/hooks/useHighScore';
import { getTheme } from '../src/theme/colors';

interface StepItemProps {
  number: string;
  title: string;
  description: string;
  boardColor: string;
  textColor: string;
}

function StepItem({ number, title, description, boardColor, textColor }: StepItemProps) {
  return (
    <View style={styles.stepRow}>
      <View style={[styles.stepBadge, { backgroundColor: boardColor }]}>
        <Text style={styles.stepBadgeText}>{number}</Text>
      </View>
      <View style={styles.stepTextContainer}>
        <Text style={[styles.stepTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.stepDescription, { color: textColor }]}>{description}</Text>
      </View>
    </View>
  );
}

export default function HowToPlayScreen() {
  const { userData, isLoaded, reload } = useHighScore();
  const theme = getTheme(userData.settings.darkMode);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  if (!isLoaded) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textPrimary }}>Memuat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: theme.textPrimary }]}>← Menu</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cara Main</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.intro, { color: theme.textPrimary }]}>
          Tujuannya sederhana: gabungkan angka yang sama sampai kamu mendapatkan tile{' '}
          <Text style={styles.boldText}>2048</Text>.
        </Text>

        <StepItem
          number="1"
          title="Geser layar (swipe)"
          description="Usap ke atas, bawah, kiri, atau kanan. Semua angka di papan akan bergeser ke arah tersebut."
          boardColor={theme.boardBackground}
          textColor={theme.textPrimary}
        />
        <StepItem
          number="2"
          title="Angka sama akan bergabung"
          description="Kalau dua tile dengan angka yang sama bertemu, mereka akan bergabung jadi satu tile dengan angka dua kali lipat. Contoh: 2 + 2 = 4."
          boardColor={theme.boardBackground}
          textColor={theme.textPrimary}
        />
        <StepItem
          number="3"
          title="Tile baru muncul otomatis"
          description="Setiap kali kamu berhasil menggeser, satu tile baru (angka 2 atau 4) akan muncul di posisi kosong secara acak."
          boardColor={theme.boardBackground}
          textColor={theme.textPrimary}
        />
        <StepItem
          number="4"
          title="Kumpulkan skor setinggi mungkin"
          description="Setiap penggabungan menambah skor kamu. Semakin besar angka yang digabung, semakin besar skor yang didapat."
          boardColor={theme.boardBackground}
          textColor={theme.textPrimary}
        />
        <StepItem
          number="5"
          title="Permainan selesai saat papan penuh"
          description="Kalau papan penuh dan tidak ada lagi gerakan yang bisa menggabungkan angka, permainan berakhir. Coba kalahkan skor terbaikmu!"
          boardColor={theme.boardBackground}
          textColor={theme.textPrimary}
        />

        <View style={[styles.tipBox, { backgroundColor: theme.boardBackground }]}>
          <Text style={styles.tipTitle}>💡 Tips</Text>
          <Text style={styles.tipText}>
            Coba fokuskan angka besar di salah satu sudut papan. Ini memudahkan kamu mengatur strategi penggabungan tanpa membuat papan cepat penuh.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { fontSize: 16, fontWeight: 'bold', width: 50 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40 },
  intro: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  boldText: { fontWeight: 'bold' },
  stepRow: { flexDirection: 'row', marginBottom: 20, gap: 14 },
  stepBadge: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  stepBadgeText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  stepTextContainer: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  stepDescription: { fontSize: 13, lineHeight: 19, opacity: 0.85 },
  tipBox: { borderRadius: 8, padding: 16, marginTop: 8 },
  tipTitle: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14, marginBottom: 6 },
  tipText: { color: '#FFFFFF', fontSize: 13, lineHeight: 19, opacity: 0.95 },
});