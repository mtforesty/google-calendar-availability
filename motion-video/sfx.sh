#!/usr/bin/env bash
# ffmpeg だけで効果音を合成する。素材サイトもAPIも要らない。
#   ./sfx.sh wind  out/wind.wav  8      … 風(秒数)
#   ./sfx.sh knock out/knock.wav        … ノック3回
#   ./sfx.sh pop   out/pop.wav          … 文字が出る「ポッ」
#   ./sfx.sh rise  out/rise.wav  2      … 盛り上がる「シュワー」
# 鳴らす位置は ffmpeg の adelay で調整: ffmpeg -i a.wav -af "adelay=1500|1500" b.wav (1.5秒後)
set -euo pipefail
kind=$1; out=$2; dur=${3:-4}
mkdir -p "$(dirname "$out")"
case $kind in
  wind)  ffmpeg -y -loglevel error -f lavfi -i "anoisesrc=c=brown:d=$dur:a=0.6" \
           -af "lowpass=f=500,tremolo=f=0.25:d=0.6,afade=t=in:d=1.5,afade=t=out:st=$(echo "$dur-1.5" | bc):d=1.5,volume=0.8" "$out" ;;
  knock) ffmpeg -y -loglevel error -f lavfi -i "sine=f=110:d=0.12" -f lavfi -i "anoisesrc=c=brown:d=0.12:a=0.7" \
           -filter_complex "[0][1]amix=2,lowpass=f=900,afade=t=out:st=0.01:d=0.11,apad=pad_dur=0.23[k];[k]asplit=3[a][b][c];[a][b][c]concat=n=3:v=0:a=1,volume=2" "$out" ;;
  pop)   ffmpeg -y -loglevel error -f lavfi -i "sine=f=880:d=0.08" -af "afade=t=out:st=0:d=0.08,volume=0.5" "$out" ;;
  rise)  ffmpeg -y -loglevel error -f lavfi -i "anoisesrc=c=pink:d=$dur:a=0.4" \
           -af "highpass=f=800,afade=t=in:d=$dur:curve=exp,volume=0.7" "$out" ;;
  *) echo "unknown: $kind (wind|knock|pop|rise)"; exit 1 ;;
esac
echo "wrote $out"
