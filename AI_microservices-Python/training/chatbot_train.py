import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

import json
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from datetime import datetime

from core.chatbot.nltk_utils import tokenize, stem, bag_of_words
from models.chatbot.model import ChatbotModel

INTENT_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'intents.json')

with open(INTENT_PATH, 'r', encoding='utf-8') as f:
    intents = json.load(f)

all_words = []
tags = []
xy = []

for intent in intents['intents']:
    tag = intent['tag']
    tags.append(tag)
    for pattern in intent['patterns']:
        w = tokenize(pattern)
        all_words.extend(w)
        xy.append((w, tag))

ignore_words = ['?', '!', '.', ',']
all_words = sorted(set(stem(w) for w in all_words if w not in ignore_words))
tags = sorted(set(tags))

X_train = []
y_train = []

for (pattern_sentence, tag) in xy:
    bag = bag_of_words(pattern_sentence, all_words)
    X_train.append(bag)
    y_train.append(tags.index(tag))

X_train = torch.tensor(X_train, dtype=torch.float32)
y_train = torch.tensor(y_train, dtype=torch.long)

class ChatDataset(Dataset):
    def __len__(self):
        return len(X_train)
    def __getitem__(self, idx):
        return X_train[idx], y_train[idx]

batch_size = 16
hidden_size = 128
input_size = len(all_words)
output_size = len(tags)
learning_rate = 3e-4
num_epochs = 300

dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset, batch_size=batch_size, shuffle=True)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = ChatbotModel(input_size, hidden_size, output_size).to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=1e-4)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, factor=0.5, patience=10)

print("Entrenando a Guardian Paw...")
for epoch in range(num_epochs):
    model.train()
    for words, labels in train_loader:
        words = words.to(device)
        labels = labels.to(device)
        
        outputs = model(words)
        loss = criterion(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    
    scheduler.step(loss)
    
    if (epoch + 1) % 50 == 0:
        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}, LR: {optimizer.param_groups[0]['lr']:.6f}")

timestamp = datetime.now().strftime("%Y%m%d_%H%M")
FILE = os.path.join(os.path.dirname(__file__), '..', 'training', 'Vector_training_model.pth')

data = {
    "model_state": model.state_dict(),
    "input_size": input_size,
    "hidden_size": hidden_size,
    "output_size": output_size,
    "all_words": all_words,
    "tags": tags
}

torch.save(data, FILE)
print(f"El entrenamiento de Vector ha sido completado. Modelo guardado en: {FILE}")
